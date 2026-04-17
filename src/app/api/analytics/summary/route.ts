import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    const where = workspaceId ? { workspaceId } : {}

    // Get basic totals
    const [totalItems, resolvedItems, criticalItems, items] = await Promise.all([
      db.analysisItem.count({ where }),
      db.analysisItem.count({ where: { ...where, status: 'RESOLVED' } }),
      db.analysisItem.count({ where: { ...where, priority: 'CRITICAL' } }),
      db.analysisItem.findMany({
        where,
        include: { analysis: true },
        orderBy: { createdAt: 'desc' }
      })
    ])

    // Calculate trends (mock data for demo)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5) + 1,
        cumulative: totalItems - Math.floor(Math.random() * 10)
      }
    })

    // Priority distribution
    const priorityDistribution = [
      { name: 'Critical', value: items.filter(i => i.priority === 'CRITICAL').length, color: '#ef4444' },
      { name: 'High', value: items.filter(i => i.priority === 'HIGH').length, color: '#f97316' },
      { name: 'Medium', value: items.filter(i => i.priority === 'MEDIUM').length, color: '#eab308' },
      { name: 'Low', value: items.filter(i => i.priority === 'LOW').length, color: '#64748b' }
    ]

    // Category breakdown
    const categoryMap = new Map<string, number>()
    items.forEach(item => {
      if (item.category) {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1)
      }
    })

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    // Processing volume (last 30 days)
    const processingVolume = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 8) + 2
      }
    })

    // Calculate estimated time saved
    const avgWordsPerItem = items.reduce((sum, item) => {
      return sum + (item.extractedText?.split(' ').length || 0)
    }, 0) / (items.length || 1)

    const estimatedTimeSaved = Math.round(totalItems * (15 + (avgWordsPerItem / 100) * 2))

    const analytics = {
      totals: {
        totalItems,
        resolvedItems,
        criticalItems,
        processingRate: resolvedItems / (totalItems || 1),
        estimatedTimeSaved
      },
      trends: {
        last7Days,
        processingVolume
      },
      distributions: {
        priority: priorityDistribution,
        category: categoryBreakdown,
        status: [
          { name: 'Completed', value: items.filter(i => i.status === 'COMPLETED').length },
          { name: 'Processing', value: items.filter(i => i.status === 'PROCESSING').length },
          { name: 'Resolved', value: items.filter(i => i.status === 'RESOLVED').length },
          { name: 'Failed', value: items.filter(i => i.status === 'FAILED').length }
        ]
      },
      recentActivity: items.slice(0, 5).map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        priority: item.priority,
        createdAt: item.createdAt,
        type: 'analysis_completed'
      }))
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}