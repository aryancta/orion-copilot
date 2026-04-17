import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['ENTERPRISE', 'EDUCATION'])
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)

    const [workspaces, total] = await Promise.all([
      db.workspace.findMany({
        take: limit,
        skip: offset,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: {
              items: true,
              questions: true
            }
          }
        }
      }),
      db.workspace.count()
    ])

    return NextResponse.json({
      workspaces,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Failed to fetch workspaces:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workspaces' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, type } = createWorkspaceSchema.parse(body)

    const workspace = await db.workspace.create({
      data: {
        name,
        description,
        type
      },
      include: {
        _count: {
          select: {
            items: true,
            questions: true
          }
        }
      }
    })

    return NextResponse.json({ workspace }, { status: 201 })
  } catch (error) {
    console.error('Failed to create workspace:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    )
  }
}