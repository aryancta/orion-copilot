import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuditTrail } from '@/lib/audit-trail'

export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params

    const item = await db.analysisItem.findUnique({
      where: { id: itemId },
      include: {
        workspace: true,
        analysis: true,
        auditEvents: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields in analysis
    let analysis = null
    if (item.analysis) {
      analysis = {
        ...item.analysis,
        actionItems: JSON.parse(item.analysis.actionItems),
        entities: JSON.parse(item.analysis.entities),
        signals: JSON.parse(item.analysis.signals)
      }
    }

    // Parse audit events metadata
    const auditTrail = item.auditEvents.map(event => ({
      ...event,
      metadata: JSON.parse(event.metadata)
    }))

    return NextResponse.json({
      item: {
        ...item,
        analysis
      },
      auditTrail
    })
  } catch (error) {
    console.error('Failed to fetch item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}