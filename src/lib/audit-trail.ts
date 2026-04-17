/**
 * Audit trail generation system
 * Creates explainable logs for all AI decisions and processing steps
 */

import { AnalysisOutput } from './analysis'
import { ExtractionResult } from './extract-text'
import { db } from './db'

export interface AuditEvent {
  id?: string
  itemId: string
  eventType: string
  message: string
  metadata: Record<string, any>
  createdAt?: Date
}

/**
 * Generate audit events for document upload
 */
export function generateUploadAuditEvents(
  itemId: string,
  filename: string | null,
  sourceType: 'FILE' | 'TEXT',
  contentLength: number
): AuditEvent[] {
  const events: AuditEvent[] = []

  events.push({
    itemId,
    eventType: 'uploaded',
    message: sourceType === 'FILE' 
      ? `Document uploaded: ${filename}` 
      : 'Text content pasted',
    metadata: {
      sourceType,
      filename: filename || null,
      contentLength,
      uploadMethod: sourceType === 'FILE' ? 'file_upload' : 'text_paste',
      timestamp: new Date().toISOString()
    }
  })

  return events
}

/**
 * Generate audit events for text extraction
 */
export function generateExtractionAuditEvents(
  itemId: string,
  extractionResult: ExtractionResult,
  sourceType: 'FILE' | 'TEXT'
): AuditEvent[] {
  const events: AuditEvent[] = []
  const { text, metadata, warnings } = extractionResult

  events.push({
    itemId,
    eventType: 'extracted',
    message: sourceType === 'FILE' 
      ? `Text extracted from file (${metadata.wordCount} words, ${Math.round(metadata.confidence * 100)}% confidence)`
      : `Text content processed (${metadata.wordCount} words)`,
    metadata: {
      extractedLength: text.length,
      wordCount: metadata.wordCount,
      confidence: metadata.confidence,
      pageCount: metadata.pageCount || null,
      warnings: warnings,
      extractionMethod: sourceType === 'FILE' ? 'file_parsing' : 'direct_input'
    }
  })

  // Add warning events if any
  if (warnings.length > 0) {
    events.push({
      itemId,
      eventType: 'extraction_warning',
      message: `Extraction completed with ${warnings.length} warning(s)`,
      metadata: {
        warnings: warnings,
        severity: 'warning'
      }
    })
  }

  return events
}

/**
 * Generate audit events for AI analysis
 */
export function generateAnalysisAuditEvents(
  itemId: string,
  analysisResult: AnalysisOutput,
  processingTime: number
): AuditEvent[] {
  const events: AuditEvent[] = []

  // Classification event
  events.push({
    itemId,
    eventType: 'classified',
    message: `Classified as "${analysisResult.category}" with ${Math.round(analysisResult.confidence * 100)}% confidence`,
    metadata: {
      category: analysisResult.category,
      priorityScore: analysisResult.priorityScore,
      riskScore: analysisResult.riskScore,
      confidence: analysisResult.confidence,
      detectedSignals: {
        urgencyCount: analysisResult.signals.urgencyKeywords.length,
        timeConstraintsCount: analysisResult.signals.timeConstraints.length,
        riskIndicatorsCount: analysisResult.signals.riskIndicators.length,
        stakeholdersCount: analysisResult.signals.stakeholders.length
      }
    }
  })

  // Priority scoring event
  events.push({
    itemId,
    eventType: 'priority_scored',
    message: `Priority score: ${analysisResult.priorityScore}/100 based on urgency signals and content analysis`,
    metadata: {
      priorityScore: analysisResult.priorityScore,
      scoringFactors: {
        urgencyKeywords: analysisResult.signals.urgencyKeywords,
        timeConstraints: analysisResult.signals.timeConstraints.slice(0, 3), // Limit for brevity
        hasFinancialAmount: analysisResult.signals.amounts.length > 0,
        stakeholderCount: analysisResult.signals.stakeholders.length
      },
      confidence: analysisResult.confidence
    }
  })

  // Risk assessment event  
  events.push({
    itemId,
    eventType: 'risk_assessed',
    message: `Risk level: ${analysisResult.riskScore}/100 based on detected risk indicators`,
    metadata: {
      riskScore: analysisResult.riskScore,
      riskFactors: {
        riskIndicators: analysisResult.signals.riskIndicators.slice(0, 5),
        hasComplexStakeholders: analysisResult.signals.stakeholders.length > 2,
        hasFinancialRisk: analysisResult.signals.amounts.some(amount => 
          /\$[\d,]*[5-9]\d{3,}/i.test(amount)
        )
      }
    }
  })

  // Entity extraction event
  if (analysisResult.entities.length > 0) {
    events.push({
      itemId,
      eventType: 'entities_extracted',
      message: `Extracted ${analysisResult.entities.length} entities (persons, organizations, dates, amounts)`,
      metadata: {
        entityCount: analysisResult.entities.length,
        entityTypes: analysisResult.entities.reduce((acc, entity) => {
          acc[entity.type] = (acc[entity.type] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        topEntities: analysisResult.entities.slice(0, 5).map(e => ({
          type: e.type,
          value: e.value,
          confidence: e.confidence
        }))
      }
    })
  }

  // Summary generation event
  events.push({
    itemId,
    eventType: 'summarized',
    message: 'AI summary and recommendations generated',
    metadata: {
      summaryLength: analysisResult.summary.length,
      actionItemsCount: analysisResult.actionItems.length,
      recommendationGenerated: analysisResult.recommendation.length > 0,
      processingTimeMs: processingTime,
      modelVersion: 'v1.0',
      analysisComponents: {
        hasSummary: analysisResult.summary.length > 0,
        hasActionItems: analysisResult.actionItems.length > 0,
        hasRecommendation: analysisResult.recommendation.length > 0,
        hasEntities: analysisResult.entities.length > 0
      }
    }
  })

  return events
}

/**
 * Generate audit event for manual actions
 */
export function generateManualAuditEvent(
  itemId: string,
  eventType: string,
  action: string,
  userId?: string,
  metadata?: Record<string, any>
): AuditEvent {
  return {
    itemId,
    eventType,
    message: action,
    metadata: {
      triggeredBy: 'user',
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      ...metadata
    }
  }
}

/**
 * Save audit events to database
 */
export async function saveAuditEvents(events: AuditEvent[]): Promise<void> {
  try {
    await db.auditEvent.createMany({
      data: events.map(event => ({
        itemId: event.itemId,
        eventType: event.eventType,
        message: event.message,
        metadata: JSON.stringify(event.metadata)
      }))
    })
  } catch (error) {
    console.error('Failed to save audit events:', error)
    throw new Error('Audit trail save failed')
  }
}

/**
 * Get audit trail for an item
 */
export async function getAuditTrail(itemId: string) {
  try {
    const events = await db.auditEvent.findMany({
      where: { itemId },
      orderBy: { createdAt: 'asc' }
    })

    return events.map(event => ({
      ...event,
      metadata: JSON.parse(event.metadata)
    }))
  } catch (error) {
    console.error('Failed to fetch audit trail:', error)
    return []
  }
}

/**
 * Generate explanation text for audit events
 */
export function explainAuditEvent(event: AuditEvent): string {
  const explanations: Record<string, (event: AuditEvent) => string> = {
    uploaded: (e) => `Document was uploaded${e.metadata.filename ? ` as "${e.metadata.filename}"` : ''} with ${e.metadata.contentLength} characters of content.`,
    
    extracted: (e) => `Text extraction completed with ${e.metadata.confidence * 100}% confidence, producing ${e.metadata.wordCount} words${e.metadata.pageCount ? ` from ${e.metadata.pageCount} pages` : ''}.`,
    
    classified: (e) => `AI classified this as "${e.metadata.category}" based on content analysis. Priority score of ${e.metadata.priorityScore}/100 and risk score of ${e.metadata.riskScore}/100 were calculated.`,
    
    priority_scored: (e) => `Priority determined by analyzing ${e.metadata.scoringFactors.urgencyKeywords?.length || 0} urgency keywords, ${e.metadata.scoringFactors.timeConstraints?.length || 0} time constraints, and ${e.metadata.scoringFactors.stakeholderCount || 0} stakeholder references.`,
    
    risk_assessed: (e) => `Risk assessment considered ${e.metadata.riskFactors.riskIndicators?.length || 0} risk indicators${e.metadata.riskFactors.hasFinancialRisk ? ', financial impact' : ''}${e.metadata.riskFactors.hasComplexStakeholders ? ', and multi-stakeholder complexity' : ''}.`,
    
    entities_extracted: (e) => `Identified ${e.metadata.entityCount} entities including ${Object.entries(e.metadata.entityTypes).map(([type, count]) => `${count} ${type.toLowerCase()}`).join(', ')}.`,
    
    summarized: (e) => `Generated ${e.metadata.summaryLength}-character summary with ${e.metadata.actionItemsCount} action items in ${e.metadata.processingTimeMs}ms using model ${e.metadata.modelVersion}.`
  }

  const explainer = explanations[event.eventType]
  return explainer ? explainer(event) : event.message
}