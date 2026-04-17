import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const querySchema = z.object({
  workspaceId: z.string(),
  question: z.string().min(1).max(500)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workspaceId, question } = querySchema.parse(body)

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

    // Get workspace items for context
    const items = await db.analysisItem.findMany({
      where: { workspaceId },
      include: { analysis: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Generate answer based on question and context
    const answer = await generateAnswer(question, items, workspace.type)
    const citations = generateCitations(question, items)
    const confidence = calculateAnswerConfidence(question, items)

    // Save the question and answer
    const savedQuestion = await db.workspaceQuestion.create({
      data: {
        workspaceId,
        question,
        answer,
        citations: JSON.stringify(citations),
        confidence
      }
    })

    return NextResponse.json({
      answer,
      citations,
      confidence,
      id: savedQuestion.id
    })

  } catch (error) {
    console.error('Assistant query failed:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    )
  }
}

async function generateAnswer(
  question: string, 
  items: any[], 
  workspaceType: string
): Promise<string> {
  const lowerQuestion = question.toLowerCase()
  
  // Pre-built responses for common questions
  const responses: Record<string, (items: any[]) => string> = {
    'critical': (items) => {
      const criticalItems = items.filter(item => item.priority === 'CRITICAL')
      if (criticalItems.length === 0) {
        return "Currently, there are no critical priority items in your workspace."
      }
      return `There are ${criticalItems.length} critical items requiring immediate attention: ${criticalItems.slice(0, 3).map(item => `"${item.title}"`).join(', ')}${criticalItems.length > 3 ? ' and others' : ''}.`
    },
    
    'urgent': (items) => {
      const urgentItems = items.filter(item => ['CRITICAL', 'HIGH'].includes(item.priority || ''))
      if (urgentItems.length === 0) {
        return "No urgent items found. All current items are medium or low priority."
      }
      return `There are ${urgentItems.length} urgent items (critical/high priority) that need attention: ${urgentItems.slice(0, 3).map(item => `"${item.title}" (${item.priority})`).join(', ')}.`
    },
    
    'budget': (items) => {
      const budgetItems = items.filter(item => 
        item.category?.toLowerCase().includes('budget') || 
        item.title?.toLowerCase().includes('budget') ||
        item.summary?.toLowerCase().includes('budget')
      )
      if (budgetItems.length === 0) {
        return "No budget-related requests found in the current workspace."
      }
      return `Found ${budgetItems.length} budget-related items: ${budgetItems.map(item => `"${item.title}"`).join(', ')}.`
    },
    
    'resolved': (items) => {
      const resolvedItems = items.filter(item => item.status === 'RESOLVED')
      const totalItems = items.length
      const resolutionRate = totalItems > 0 ? Math.round((resolvedItems.length / totalItems) * 100) : 0
      return `${resolvedItems.length} out of ${totalItems} items have been resolved (${resolutionRate}% completion rate).`
    },
    
    'categories': (items) => {
      const categoryMap = new Map()
      items.forEach(item => {
        if (item.category) {
          categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1)
        }
      })
      const topCategories = Array.from(categoryMap.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
      
      if (topCategories.length === 0) {
        return "No categorized items found."
      }
      
      return `The main categories are: ${topCategories.map(([cat, count]) => `${cat} (${count} items)`).join(', ')}.`
    },

    'status': (items) => {
      const statusMap = new Map()
      items.forEach(item => {
        statusMap.set(item.status, (statusMap.get(item.status) || 0) + 1)
      })
      
      const statusSummary = Array.from(statusMap.entries())
        .map(([status, count]) => `${count} ${status.toLowerCase()}`)
        .join(', ')
      
      return `Current workspace status: ${statusSummary}.`
    }
  }
  
  // Match question to response patterns
  for (const [keyword, responseGenerator] of Object.entries(responses)) {
    if (lowerQuestion.includes(keyword)) {
      return responseGenerator(items)
    }
  }
  
  // Special handling for "what" questions
  if (lowerQuestion.includes('what')) {
    if (lowerQuestion.includes('most')) {
      const criticalItems = items.filter(item => item.priority === 'CRITICAL')
      const highItems = items.filter(item => item.priority === 'HIGH')
      const importantItems = [...criticalItems, ...highItems]
      
      if (importantItems.length > 0) {
        return `The most important items are: ${importantItems.slice(0, 3).map(item => `"${item.title}" (${item.priority} priority)`).join(', ')}.`
      }
    }
  }
  
  // Default contextual response
  const recentItems = items.slice(0, 3)
  const totalItems = items.length
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))]
  
  return `Based on your workspace with ${totalItems} items across ${categories.length} categories, the most recent items are: ${recentItems.map(item => `"${item.title}"`).join(', ')}. You can ask me about specific categories, priorities, or status updates.`
}

function generateCitations(question: string, items: any[]) {
  const lowerQuestion = question.toLowerCase()
  const relevantItems = items.filter(item => {
    const searchText = `${item.title} ${item.summary || ''} ${item.category || ''}`.toLowerCase()
    
    // Simple keyword matching for citations
    const keywords = question.toLowerCase().split(' ').filter(word => word.length > 3)
    return keywords.some(keyword => searchText.includes(keyword))
  }).slice(0, 3)

  return relevantItems.map(item => ({
    itemId: item.id,
    title: item.title,
    excerpt: item.summary?.substring(0, 100) + '...' || item.title,
    confidence: 0.8
  }))
}

function calculateAnswerConfidence(question: string, items: any[]): number {
  // Base confidence
  let confidence = 0.7
  
  // Higher confidence for more items
  if (items.length > 10) confidence += 0.1
  if (items.length > 20) confidence += 0.1
  
  // Higher confidence for specific questions
  const specificKeywords = ['critical', 'urgent', 'budget', 'resolved', 'status']
  const hasSpecificKeyword = specificKeywords.some(keyword => 
    question.toLowerCase().includes(keyword)
  )
  if (hasSpecificKeyword) confidence += 0.1
  
  return Math.min(confidence, 0.95)
}