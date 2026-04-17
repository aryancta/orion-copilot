import { PrismaClient } from '@prisma/client'
import { DEMO_WORKSPACES, DEMO_ITEMS, DEMO_ANALYSIS_RESULTS } from '../src/lib/demo-data'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.auditEvent.deleteMany()
  await prisma.analysisResult.deleteMany()
  await prisma.analysisItem.deleteMany()
  await prisma.workspaceQuestion.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.appConfig.deleteMany()

  // Create app config
  const appConfig = await prisma.appConfig.create({
    data: {
      id: 'singleton',
      analysisMode: 'FAST',
      demoScenario: 'ENTERPRISE',
      theme: 'DARK'
    }
  })

  // Create enterprise workspace
  const enterpriseWorkspace = await prisma.workspace.create({
    data: {
      name: DEMO_WORKSPACES.ENTERPRISE.name,
      description: DEMO_WORKSPACES.ENTERPRISE.description,
      type: DEMO_WORKSPACES.ENTERPRISE.type
    }
  })

  // Create education workspace  
  const educationWorkspace = await prisma.workspace.create({
    data: {
      name: DEMO_WORKSPACES.EDUCATION.name,
      description: DEMO_WORKSPACES.EDUCATION.description,
      type: DEMO_WORKSPACES.EDUCATION.type
    }
  })

  // Set active workspace to enterprise
  await prisma.appConfig.update({
    where: { id: 'singleton' },
    data: { activeWorkspaceId: enterpriseWorkspace.id }
  })

  console.log('📋 Creating enterprise demo items...')

  // Create enterprise demo items
  for (let i = 0; i < DEMO_ITEMS.ENTERPRISE.length; i++) {
    const itemData = DEMO_ITEMS.ENTERPRISE[i]
    const analysisData = DEMO_ANALYSIS_RESULTS.ENTERPRISE[i]
    
    // Create item
    const item = await prisma.analysisItem.create({
      data: {
        workspaceId: enterpriseWorkspace.id,
        title: itemData.title,
        sourceType: itemData.sourceType,
        filename: itemData.filename,
        mimeType: itemData.mimeType,
        rawContent: itemData.rawContent,
        extractedText: itemData.extractedText,
        status: itemData.status,
        category: itemData.category,
        priority: itemData.priority,
        riskLevel: itemData.riskLevel,
        summary: itemData.summary,
        recommendation: itemData.recommendation,
        confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0
      }
    })

    // Create analysis result
    await prisma.analysisResult.create({
      data: {
        itemId: item.id,
        summary: analysisData.summary,
        actionItems: analysisData.actionItems,
        entities: analysisData.entities,
        signals: analysisData.signals,
        priorityScore: analysisData.priorityScore,
        riskScore: analysisData.riskScore,
        category: analysisData.category,
        recommendation: analysisData.recommendation,
        modelVersion: 'v1.0'
      }
    })

    // Create audit events
    const auditEvents = [
      {
        itemId: item.id,
        eventType: 'uploaded',
        message: `Document uploaded: ${itemData.title}`,
        metadata: JSON.stringify({
          sourceType: itemData.sourceType,
          filename: itemData.filename,
          size: itemData.rawContent.length
        })
      },
      {
        itemId: item.id,
        eventType: 'extracted',
        message: 'Text content extracted successfully',
        metadata: JSON.stringify({
          extractedLength: itemData.extractedText.length,
          confidence: 0.95
        })
      },
      {
        itemId: item.id,
        eventType: 'classified',
        message: `Classified as ${analysisData.category} with ${analysisData.priorityScore}% priority confidence`,
        metadata: JSON.stringify({
          category: analysisData.category,
          priority: itemData.priority,
          riskLevel: itemData.riskLevel,
          confidence: analysisData.priorityScore / 100
        })
      },
      {
        itemId: item.id,
        eventType: 'summarized',
        message: 'AI summary and recommendations generated',
        metadata: JSON.stringify({
          summaryLength: analysisData.summary.length,
          actionItemsCount: JSON.parse(analysisData.actionItems).length,
          modelVersion: 'v1.0'
        })
      }
    ]

    for (const eventData of auditEvents) {
      await prisma.auditEvent.create({
        data: eventData
      })
    }
  }

  console.log('🎓 Creating education demo items...')

  // Create education demo items
  for (let i = 0; i < DEMO_ITEMS.EDUCATION.length; i++) {
    const itemData = DEMO_ITEMS.EDUCATION[i]
    const analysisData = DEMO_ANALYSIS_RESULTS.EDUCATION[i]
    
    // Create item
    const item = await prisma.analysisItem.create({
      data: {
        workspaceId: educationWorkspace.id,
        title: itemData.title,
        sourceType: itemData.sourceType,
        filename: itemData.filename,
        mimeType: itemData.mimeType,
        rawContent: itemData.rawContent,
        extractedText: itemData.extractedText,
        status: itemData.status,
        category: itemData.category,
        priority: itemData.priority,
        riskLevel: itemData.riskLevel,
        summary: itemData.summary,
        recommendation: itemData.recommendation,
        confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0
      }
    })

    // Create analysis result
    await prisma.analysisResult.create({
      data: {
        itemId: item.id,
        summary: analysisData.summary,
        actionItems: analysisData.actionItems,
        entities: analysisData.entities,
        signals: analysisData.signals,
        priorityScore: analysisData.priorityScore,
        riskScore: analysisData.riskScore,
        category: analysisData.category,
        recommendation: analysisData.recommendation,
        modelVersion: 'v1.0'
      }
    })

    // Create audit events
    const auditEvents = [
      {
        itemId: item.id,
        eventType: 'uploaded',
        message: `Document uploaded: ${itemData.title}`,
        metadata: JSON.stringify({
          sourceType: itemData.sourceType,
          filename: itemData.filename,
          size: itemData.rawContent.length
        })
      },
      {
        itemId: item.id,
        eventType: 'extracted',
        message: 'Text content extracted successfully',
        metadata: JSON.stringify({
          extractedLength: itemData.extractedText.length,
          confidence: 0.95
        })
      },
      {
        itemId: item.id,
        eventType: 'classified',
        message: `Classified as ${analysisData.category} with ${analysisData.priorityScore}% priority confidence`,
        metadata: JSON.stringify({
          category: analysisData.category,
          priority: itemData.priority,
          riskLevel: itemData.riskLevel,
          confidence: analysisData.priorityScore / 100
        })
      },
      {
        itemId: item.id,
        eventType: 'summarized',
        message: 'AI summary and recommendations generated',
        metadata: JSON.stringify({
          summaryLength: analysisData.summary.length,
          actionItemsCount: JSON.parse(analysisData.actionItems).length,
          modelVersion: 'v1.0'
        })
      }
    ]

    for (const eventData of auditEvents) {
      await prisma.auditEvent.create({
        data: eventData
      })
    }
  }

  console.log('💬 Creating sample workspace questions...')

  // Create sample workspace questions for enterprise
  const enterpriseQuestions = [
    {
      workspaceId: enterpriseWorkspace.id,
      question: "What are the most critical issues this week?",
      answer: "This week's most critical issues include: 1) Payment gateway outage affecting 200+ premium customers with significant revenue impact, and 2) Security policy implementation requiring immediate IT team coordination. Both require urgent escalation and resource allocation.",
      citations: JSON.stringify([
        {
          itemId: "sample-citation-1",
          title: "Customer Escalation - Payment Processing Issue", 
          excerpt: "Critical payment gateway outage affecting 200+ premium customers",
          confidence: 0.95
        }
      ]),
      confidence: 0.88
    },
    {
      workspaceId: enterpriseWorkspace.id,
      question: "What budget requests are pending approval?",
      answer: "Currently there is one pending budget request: Q2 Digital Marketing Campaign requesting $75,000 with projected 3.2x ROI. The request includes social media advertising ($30K), Google Ads ($25K), content creation ($15K), and analytics tools ($5K). Approval deadline is April 20th.",
      citations: JSON.stringify([
        {
          itemId: "sample-citation-2",
          title: "Budget Request - Q2 Marketing Campaign",
          excerpt: "$75K budget request for Q2 marketing campaign with projected 3.2x ROI",
          confidence: 0.92
        }
      ]),
      confidence: 0.85
    }
  ]

  for (const question of enterpriseQuestions) {
    await prisma.workspaceQuestion.create({
      data: question
    })
  }

  // Create sample workspace questions for education
  const educationQuestions = [
    {
      workspaceId: educationWorkspace.id,
      question: "What student support cases need immediate attention?",
      answer: "The most urgent student support case is Alex Thompson (Biology Major, 3.4 GPA) experiencing severe financial hardship due to family emergency. The student has an $8,500 outstanding balance and is considering withdrawal. Immediate intervention needed including emergency financial aid review and work-study placement.",
      citations: JSON.stringify([
        {
          itemId: "sample-citation-3",
          title: "Student Support - Financial Hardship",
          excerpt: "Critical student financial hardship case requiring immediate intervention",
          confidence: 0.93
        }
      ]),
      confidence: 0.91
    },
    {
      workspaceId: educationWorkspace.id,
      question: "What facility requests are pending?",
      answer: "There's a critical $170K chemistry lab equipment upgrade request for Lab C-204 affecting 450+ students annually. Current equipment is 15+ years old with 300% increased failure rate. Required for ABET accreditation and needed by Fall 2024. Department has $50K allocated, seeking additional $120K funding.",
      citations: JSON.stringify([
        {
          itemId: "sample-citation-4",
          title: "Facility Request - Lab Equipment Upgrade",
          excerpt: "$170K chemistry lab equipment upgrade affecting 450+ students and ABET accreditation",
          confidence: 0.89
        }
      ]),
      confidence: 0.87
    }
  ]

  for (const question of educationQuestions) {
    await prisma.workspaceQuestion.create({
      data: question
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created ${DEMO_ITEMS.ENTERPRISE.length} enterprise items and ${DEMO_ITEMS.EDUCATION.length} education items`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })