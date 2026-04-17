/**
 * Deterministic AI analysis engine for document processing
 * Provides structured analysis without requiring external API keys
 */

import { extractKeywords } from './utils'
import { Priority, RiskLevel } from './types'

export interface AnalysisInput {
  text: string
  title?: string
  sourceType: 'FILE' | 'TEXT'
  filename?: string
  workspaceType: 'ENTERPRISE' | 'EDUCATION'
}

export interface AnalysisOutput {
  summary: string
  actionItems: string[]
  entities: ExtractedEntity[]
  signals: DetectedSignals
  priorityScore: number
  riskScore: number
  category: string
  recommendation: string
  confidence: number
}

export interface ExtractedEntity {
  type: 'PERSON' | 'ORGANIZATION' | 'DATE' | 'LOCATION' | 'AMOUNT' | 'OTHER'
  value: string
  confidence: number
}

export interface DetectedSignals {
  urgencyKeywords: string[]
  timeConstraints: string[]
  riskIndicators: string[]
  stakeholders: string[]
  amounts: string[]
  deadlines: string[]
}

/**
 * Analyze document content and generate structured insights
 */
export async function analyzeDocument(input: AnalysisInput): Promise<AnalysisOutput> {
  const { text, workspaceType } = input
  
  // Extract basic signals
  const signals = detectSignals(text)
  const entities = extractEntities(text)
  
  // Calculate priority and risk scores
  const priorityScore = calculatePriorityScore(text, signals, workspaceType)
  const riskScore = calculateRiskScore(text, signals, workspaceType)
  
  // Determine category
  const category = classifyCategory(text, workspaceType)
  
  // Generate summary and action items
  const summary = generateSummary(text, category, priorityScore)
  const actionItems = extractActionItems(text, category, workspaceType)
  
  // Generate recommendation
  const recommendation = generateRecommendation(
    category, 
    priorityScore, 
    riskScore, 
    workspaceType
  )
  
  // Calculate overall confidence
  const confidence = calculateConfidence(text, signals, entities)
  
  return {
    summary,
    actionItems,
    entities,
    signals,
    priorityScore,
    riskScore,
    category,
    recommendation,
    confidence
  }
}

/**
 * Detect various signals in the text
 */
function detectSignals(text: string): DetectedSignals {
  const lowerText = text.toLowerCase()
  
  const urgencyPatterns = [
    /urgent/gi, /asap/gi, /immediate/gi, /emergency/gi, /critical/gi,
    /escalate/gi, /priority/gi, /deadline/gi, /time.sensitive/gi
  ]
  
  const timePatterns = [
    /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, // dates
    /\b\d{1,2}-\d{1,2}-\d{4}\b/g,
    /\bmarch|april|may|june|july|august|september|october|november|december\s+\d{1,2}/gi,
    /\btoday|tomorrow|this week|next week|end of week/gi,
    /\bdeadline|due date|expires|by\s+\w+\s+\d+/gi
  ]
  
  const riskPatterns = [
    /problem|issue|error|failure|down|outage|broken/gi,
    /complaint|escalation|angry|frustrated|disappointed/gi,
    /legal|compliance|violation|breach|audit/gi,
    /budget|cost|expensive|funding|financial/gi
  ]
  
  const stakeholderPatterns = [
    /customer|client|user|student|faculty|administrator/gi,
    /team|department|management|executive|director/gi,
    /vendor|partner|supplier|contractor/gi
  ]
  
  const amountPatterns = [
    /\$[\d,]+\.?\d*/g,
    /\b\d+\s*k\b/gi, // e.g., "50K"
    /\b\d+\s*million\b/gi,
    /budget|cost|price|fee|payment/gi
  ]
  
  return {
    urgencyKeywords: extractMatches(text, urgencyPatterns),
    timeConstraints: extractMatches(text, timePatterns),
    riskIndicators: extractMatches(text, riskPatterns),
    stakeholders: extractMatches(text, stakeholderPatterns),
    amounts: extractMatches(text, amountPatterns),
    deadlines: extractMatches(text, timePatterns.slice(-2))
  }
}

/**
 * Extract entities from text
 */
function extractEntities(text: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = []
  
  // Person names (simplified pattern)
  const namePattern = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g
  const names = text.match(namePattern) || []
  names.forEach(name => {
    entities.push({
      type: 'PERSON',
      value: name,
      confidence: 0.7
    })
  })
  
  // Organizations (common suffixes)
  const orgPattern = /\b[A-Z][a-zA-Z\s]*(?:Corp|Corporation|Inc|LLC|Ltd|Company|Team|Department|University|College|School)\b/g
  const orgs = text.match(orgPattern) || []
  orgs.forEach(org => {
    entities.push({
      type: 'ORGANIZATION',
      value: org,
      confidence: 0.8
    })
  })
  
  // Dates
  const datePattern = /\b(?:\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4}|[A-Z][a-z]+\s+\d{1,2},?\s+\d{4})\b/g
  const dates = text.match(datePattern) || []
  dates.forEach(date => {
    entities.push({
      type: 'DATE',
      value: date,
      confidence: 0.9
    })
  })
  
  // Amounts
  const amountPattern = /\$[\d,]+\.?\d*/g
  const amounts = text.match(amountPattern) || []
  amounts.forEach(amount => {
    entities.push({
      type: 'AMOUNT',
      value: amount,
      confidence: 0.95
    })
  })
  
  return entities.slice(0, 10) // Limit to top 10
}

/**
 * Calculate priority score (0-100)
 */
function calculatePriorityScore(
  text: string, 
  signals: DetectedSignals, 
  workspaceType: string
): number {
  let score = 50 // Base score
  
  // Urgency keywords
  score += signals.urgencyKeywords.length * 15
  
  // Time constraints
  if (signals.timeConstraints.length > 0) {
    score += 10
  }
  
  // Risk indicators
  score += signals.riskIndicators.length * 8
  
  // Financial amounts (higher priority for larger amounts)
  const hasLargeAmount = signals.amounts.some(amount => 
    /\$[\d,]*[5-9]\d{3,}|k|million/i.test(amount)
  )
  if (hasLargeAmount) {
    score += 15
  }
  
  // Workspace-specific adjustments
  if (workspaceType === 'ENTERPRISE') {
    if (text.toLowerCase().includes('customer') || 
        text.toLowerCase().includes('revenue')) {
      score += 10
    }
  } else if (workspaceType === 'EDUCATION') {
    if (text.toLowerCase().includes('student') || 
        text.toLowerCase().includes('accreditation')) {
      score += 10
    }
  }
  
  return Math.min(Math.max(score, 0), 100)
}

/**
 * Calculate risk score (0-100) 
 */
function calculateRiskScore(
  text: string,
  signals: DetectedSignals,
  workspaceType: string
): number {
  let score = 20 // Base score
  
  // Risk indicators
  score += signals.riskIndicators.length * 12
  
  // Legal/compliance terms
  const legalTerms = ['legal', 'compliance', 'violation', 'audit', 'breach']
  const hasLegalRisk = legalTerms.some(term => 
    text.toLowerCase().includes(term)
  )
  if (hasLegalRisk) {
    score += 20
  }
  
  // Financial risk
  const hasFinancialRisk = signals.amounts.length > 0 && 
    signals.riskIndicators.some(risk => 
      /budget|cost|loss|deficit/i.test(risk)
    )
  if (hasFinancialRisk) {
    score += 15
  }
  
  // Stakeholder impact
  if (signals.stakeholders.length > 2) {
    score += 10
  }
  
  // Workspace-specific risks
  if (workspaceType === 'ENTERPRISE') {
    if (text.toLowerCase().includes('outage') || 
        text.toLowerCase().includes('security')) {
      score += 15
    }
  } else if (workspaceType === 'EDUCATION') {
    if (text.toLowerCase().includes('accreditation') || 
        text.toLowerCase().includes('safety')) {
      score += 15
    }
  }
  
  return Math.min(Math.max(score, 0), 100)
}

/**
 * Classify document category
 */
function classifyCategory(text: string, workspaceType: string): string {
  const lowerText = text.toLowerCase()
  
  const categoryPatterns = {
    'Technical Issue': ['error', 'bug', 'outage', 'down', 'broken', 'failure', 'system'],
    'Support Request': ['help', 'support', 'assistance', 'question', 'how to'],
    'Budget Request': ['budget', 'funding', 'cost', 'expense', 'allocation', 'financial'],
    'Policy Update': ['policy', 'procedure', 'compliance', 'guidelines', 'requirements'],
    'Security Alert': ['security', 'breach', 'vulnerability', 'threat', 'access'],
    'Academic Appeal': ['grade', 'appeal', 'academic', 'course', 'professor'],
    'Facility Request': ['facility', 'equipment', 'lab', 'classroom', 'maintenance'],
    'Student Support': ['student', 'financial aid', 'hardship', 'counseling'],
    'Administrative': ['administrative', 'process', 'workflow', 'documentation']
  }
  
  // Workspace-specific categories
  if (workspaceType === 'EDUCATION') {
    categoryPatterns['Academic Appeal'] = [...categoryPatterns['Academic Appeal'], 'transcript', 'enrollment'];
    (categoryPatterns as any)['Faculty Request'] = ['faculty', 'research', 'sabbatical', 'tenure']
  }
  
  for (const [category, keywords] of Object.entries(categoryPatterns)) {
    const matchCount = keywords.filter(keyword => 
      lowerText.includes(keyword)
    ).length
    
    if (matchCount >= 2) {
      return category
    }
  }
  
  // Default categories by workspace
  return workspaceType === 'EDUCATION' ? 'Administrative' : 'General Request'
}

/**
 * Generate concise summary
 */
function generateSummary(
  text: string, 
  category: string, 
  priorityScore: number
): string {
  const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text]
  const firstSentence = sentences[0]?.trim() || ''
  const keywords = extractKeywords(text).slice(0, 5)
  
  let summary = firstSentence.length > 150 ? 
    firstSentence.substring(0, 150) + '...' : 
    firstSentence
  
  // Add context based on category and priority
  if (priorityScore > 80) {
    summary += ' [HIGH PRIORITY]'
  }
  
  if (keywords.length > 0) {
    const keywordStr = keywords.slice(0, 3).join(', ')
    summary += ` Key areas: ${keywordStr}.`
  }
  
  return summary.trim()
}

/**
 * Extract actionable items from text
 */
function extractActionItems(
  text: string, 
  category: string, 
  workspaceType: string
): string[] {
  const actionItems: string[] = []
  
  // Look for explicit action patterns
  const actionPatterns = [
    /please\s+([^.!?]+)/gi,
    /need\s+to\s+([^.!?]+)/gi,
    /should\s+([^.!?]+)/gi,
    /must\s+([^.!?]+)/gi,
    /require[sd]?\s+([^.!?]+)/gi
  ]
  
  actionPatterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      matches.slice(0, 2).forEach(match => {
        const clean = match.replace(/^(please|need to|should|must|required?)\s+/i, '').trim()
        if (clean.length > 10 && clean.length < 100) {
          actionItems.push(clean.charAt(0).toUpperCase() + clean.slice(1))
        }
      })
    }
  })
  
  // Category-specific default actions
  const defaultActions = {
    'Technical Issue': [
      'Investigate root cause',
      'Implement temporary fix',
      'Notify affected users',
      'Document resolution steps'
    ],
    'Budget Request': [
      'Review budget allocation',
      'Verify ROI projections',
      'Schedule approval meeting',
      'Document decision rationale'
    ],
    'Academic Appeal': [
      'Schedule review committee meeting',
      'Gather supporting documentation',
      'Contact relevant faculty',
      'Document appeal process'
    ],
    'Student Support': [
      'Schedule counseling session',
      'Review financial aid options',
      'Connect with support services',
      'Monitor student progress'
    ]
  }
  
  // Add defaults if not enough actions found
  if (actionItems.length < 3 && defaultActions[category as keyof typeof defaultActions]) {
    const defaults = defaultActions[category as keyof typeof defaultActions]
    actionItems.push(...defaults.slice(0, 4 - actionItems.length))
  }
  
  return actionItems.slice(0, 5)
}

/**
 * Generate recommendation based on analysis
 */
function generateRecommendation(
  category: string,
  priorityScore: number,
  riskScore: number,
  workspaceType: string
): string {
  const urgency = priorityScore > 80 ? 'immediate' : 
                 priorityScore > 60 ? 'prompt' : 'standard'
  
  const risk = riskScore > 70 ? 'high risk' : 
               riskScore > 40 ? 'moderate risk' : 'low risk'
  
  let recommendation = ''
  
  if (urgency === 'immediate') {
    recommendation += 'Escalate immediately. '
  } else if (urgency === 'prompt') {
    recommendation += 'Address within 24-48 hours. '
  }
  
  // Category-specific recommendations
  const categoryRecommendations: Record<string, string> = {
    'Technical Issue': 'Engage technical team for resolution. Establish incident response protocol.',
    'Budget Request': 'Schedule budget committee review. Analyze ROI and past performance data.',
    'Academic Appeal': 'Convene appeals committee. Ensure due process compliance.',
    'Student Support': 'Connect with student services immediately. Provide comprehensive support plan.',
    'Policy Update': 'Plan rollout strategy. Ensure stakeholder communication.',
    'Security Alert': 'Activate security response team. Assess scope and containment needs.'
  }
  
  recommendation += categoryRecommendations[category] || 'Review and take appropriate action.'
  
  if (riskScore > 70) {
    recommendation += ' Monitor closely due to elevated risk factors.'
  }
  
  return recommendation
}

/**
 * Calculate overall confidence in analysis
 */
function calculateConfidence(
  text: string,
  signals: DetectedSignals,
  entities: ExtractedEntity[]
): number {
  let confidence = 0.6 // Base confidence
  
  // Text quality factors
  const wordCount = text.split(/\s+/).length
  if (wordCount > 50) confidence += 0.1
  if (wordCount > 200) confidence += 0.1
  
  // Signal strength
  const totalSignals = Object.values(signals).flat().length
  confidence += Math.min(totalSignals * 0.02, 0.15)
  
  // Entity extraction success
  confidence += Math.min(entities.length * 0.015, 0.1)
  
  return Math.min(Math.max(confidence, 0.4), 0.95)
}

/**
 * Helper function to extract pattern matches
 */
function extractMatches(text: string, patterns: RegExp[]): string[] {
  const matches: string[] = []
  patterns.forEach(pattern => {
    const found = text.match(pattern)
    if (found) {
      matches.push(...found)
    }
  })
  return Array.from(new Set(matches.slice(0, 10))) // Remove duplicates and limit
}