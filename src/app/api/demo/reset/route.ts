import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const resetSchema = z.object({
  scenario: z.enum(['ENTERPRISE', 'EDUCATION']).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scenario = 'ENTERPRISE' } = resetSchema.parse(body)

    // Clear existing data
    await db.auditEvent.deleteMany()
    await db.analysisResult.deleteMany()
    await db.analysisItem.deleteMany()
    await db.workspaceQuestion.deleteMany()
    await db.workspace.deleteMany()
    await db.appConfig.deleteMany()

    // Re-run seed script with specific scenario
    const { execSync } = require('child_process')
    
    try {
      // Set environment variable for scenario
      process.env.DEMO_SCENARIO = scenario
      
      // Run the seed script
      execSync('npm run seed', { stdio: 'inherit' })
      
      // Get the newly created workspace
      const workspace = await db.workspace.findFirst({
        where: { type: scenario }
      })

      if (!workspace) {
        throw new Error('Failed to create workspace during reset')
      }

      // Update app config to use the correct workspace
      await db.appConfig.updateMany({
        data: {
          activeWorkspaceId: workspace.id,
          demoScenario: scenario
        }
      })

      return NextResponse.json({
        success: true,
        workspaceId: workspace.id,
        scenario: scenario,
        message: `Demo reset to ${scenario.toLowerCase()} scenario`
      })

    } catch (seedError) {
      console.error('Seed script failed:', seedError)
      
      // Fallback: create minimal data manually
      const workspace = await db.workspace.create({
        data: {
          name: scenario === 'ENTERPRISE' ? 'Demo Enterprise' : 'Demo University',
          description: `${scenario} demo workspace`,
          type: scenario
        }
      })

      await db.appConfig.create({
        data: {
          id: 'singleton',
          activeWorkspaceId: workspace.id,
          analysisMode: 'FAST',
          demoScenario: scenario,
          theme: 'DARK'
        }
      })

      return NextResponse.json({
        success: true,
        workspaceId: workspace.id,
        scenario: scenario,
        message: `Demo reset to ${scenario.toLowerCase()} scenario (minimal data)`
      })
    }

  } catch (error) {
    console.error('Demo reset failed:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to reset demo data' },
      { status: 500 }
    )
  }
}