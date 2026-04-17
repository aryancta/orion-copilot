import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { generateManualAuditEvent, saveAuditEvents } from '@/lib/audit-trail'

const resolveItemSchema = z.object({
  resolutionNote: z.string().optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params
    const body = await request.json()
    const { resolutionNote } = resolveItemSchema.parse(body)

    // Find the item
    const existingItem = await db.analysisItem.findUnique({
      where: { id: itemId }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    // Update item status to resolved
    const updatedItem = await db.analysisItem.update({
      where: { id: itemId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date()
      },
      include: {
        workspace: true,
        analysis: true
      }
    })

    // Create audit event for resolution
    const auditEvent = generateManualAuditEvent(
      itemId,
      'resolved',
      `Item marked as resolved${resolutionNote ? `: ${resolutionNote}` : ''}`,
      'demo-user',
      {
        resolutionNote: resolutionNote || null,
        resolvedAt: new Date().toISOString()
      }
    )

    await saveAuditEvents([auditEvent])

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error('Failed to resolve item:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to resolve item' },
      { status: 500 }
    )
  }
}