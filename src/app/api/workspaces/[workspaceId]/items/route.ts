import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { analyzeDocument } from '@/lib/analysis'
import { extractTextFromContent, extractTextFromFile } from '@/lib/extract-text'
import { 
  generateUploadAuditEvents, 
  generateExtractionAuditEvents,
  generateAnalysisAuditEvents,
  saveAuditEvents 
} from '@/lib/audit-trail'
import { scoreToPriority, scoreToRiskLevel } from '@/lib/scoring'

const createItemSchema = z.object({
  sourceType: z.enum(['FILE', 'TEXT']),
  filename: z.string().optional(),
  content: z.string().min(1),
  mimeType: z.string().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const { workspaceId } = params
    
    // Query parameters
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = { workspaceId }
    
    if (status) where.status = status
    if (priority) where.priority = priority
    if (category) where.category = { contains: category, mode: 'insensitive' }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { extractedText: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [items, total] = await Promise.all([
      db.analysisItem.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          analysis: true,
          _count: {
            select: {
              auditEvents: true
            }
          }
        }
      }),
      db.analysisItem.count({ where })
    ])

    // Calculate workspace metrics
    const [totalItems, urgentItems, resolvedItems] = await Promise.all([
      db.analysisItem.count({ where: { workspaceId } }),
      db.analysisItem.count({ 
        where: { 
          workspaceId, 
          priority: { in: ['HIGH', 'CRITICAL'] },
          status: { not: 'RESOLVED' }
        } 
      }),
      db.analysisItem.count({ 
        where: { workspaceId, status: 'RESOLVED' } 
      })
    ])

    const metrics = {
      totalItems,
      urgentItems,
      resolvedItems,
      estimatedTimeSaved: totalItems * 18 // Average 18 minutes per item
    }

    return NextResponse.json({
      items,
      total,
      limit,
      offset,
      metrics
    })
  } catch (error) {
    console.error('Failed to fetch items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  const startTime = Date.now()
  
  try {
    const { workspaceId } = params
    
    // Verify workspace exists
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId }
    })
    
    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { sourceType, filename, content, mimeType } = createItemSchema.parse(body)

    // Extract text based on source type
    let extractionResult
    let extractedText = content
    let title = filename || 'Untitled'
    
    if (sourceType === 'FILE' && content.startsWith('data:')) {
      // Handle base64 file content
      const base64Data = content.split(',')[1]
      const buffer = Buffer.from(base64Data, 'base64')
      const file = new File([buffer], filename || 'untitled', { type: mimeType })
      
      extractionResult = await extractTextFromFile(file)
      extractedText = extractionResult.text
      title = filename || 'Uploaded Document'
    } else {
      // Handle plain text content
      extractionResult = extractTextFromContent(content)
      extractedText = content
      title = extractedText.split('\n')[0]?.trim().substring(0, 100) || 'Text Input'
    }

    // Create item record
    const item = await db.analysisItem.create({
      data: {
        workspaceId,
        title,
        sourceType,
        filename: filename || null,
        mimeType: mimeType || 'text/plain',
        rawContent: content,
        extractedText,
        status: 'PROCESSING'
      }
    })

    // Generate upload and extraction audit events
    const uploadEvents = generateUploadAuditEvents(
      item.id,
      filename || null,
      sourceType,
      content.length
    )
    
    const extractionEvents = generateExtractionAuditEvents(
      item.id,
      extractionResult,
      sourceType
    )

    await saveAuditEvents([...uploadEvents, ...extractionEvents])

    // Perform AI analysis
    const analysisInput = {
      text: extractedText,
      title,
      sourceType,
      filename: filename || undefined,
      workspaceType: workspace.type as 'ENTERPRISE' | 'EDUCATION'
    }

    const analysisResult = await analyzeDocument(analysisInput)
    const processingTime = Date.now() - startTime

    // Save analysis results
    const analysis = await db.analysisResult.create({
      data: {
        itemId: item.id,
        summary: analysisResult.summary,
        actionItems: JSON.stringify(analysisResult.actionItems),
        entities: JSON.stringify(analysisResult.entities),
        signals: JSON.stringify(analysisResult.signals),
        priorityScore: analysisResult.priorityScore,
        riskScore: analysisResult.riskScore,
        category: analysisResult.category,
        recommendation: analysisResult.recommendation
      }
    })

    // Update item with analysis results
    const updatedItem = await db.analysisItem.update({
      where: { id: item.id },
      data: {
        status: 'COMPLETED',
        category: analysisResult.category,
        priority: scoreToPriority(analysisResult.priorityScore),
        riskLevel: scoreToRiskLevel(analysisResult.riskScore),
        summary: analysisResult.summary,
        recommendation: analysisResult.recommendation,
        confidence: analysisResult.confidence
      },
      include: {
        analysis: true
      }
    })

    // Generate analysis audit events
    const analysisEvents = generateAnalysisAuditEvents(
      item.id,
      analysisResult,
      processingTime
    )

    await saveAuditEvents(analysisEvents)

    return NextResponse.json({
      item: updatedItem,
      analysis
    }, { status: 201 })

  } catch (error) {
    console.error('Failed to create item:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}