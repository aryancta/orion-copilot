import { Prisma } from '@prisma/client'

// Enum types for type safety
export type WorkspaceType = 'ENTERPRISE' | 'EDUCATION'
export type SourceType = 'FILE' | 'TEXT'
export type ItemStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'RESOLVED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type AnalysisMode = 'FAST' | 'DEEP'
export type DemoScenario = 'ENTERPRISE' | 'EDUCATION'
export type Theme = 'DARK' | 'LIGHT'

// Database model types with full relations
export type WorkspaceWithItems = Prisma.WorkspaceGetPayload<{
  include: {
    items: true
    questions: true
  }
}>

export type AnalysisItemWithDetails = Prisma.AnalysisItemGetPayload<{
  include: {
    workspace: true
    analysis: true
    auditEvents: true
  }
}>

export type AnalysisItemWithAnalysis = Prisma.AnalysisItemGetPayload<{
  include: {
    analysis: true
  }
}>

// API response types
export interface WorkspaceMetrics {
  totalItems: number
  urgentItems: number
  resolvedItems: number
  estimatedTimeSaved: number
}

export interface Citation {
  itemId: string
  title: string
  excerpt: string
  confidence: number
}

export interface ActionItem {
  id: string
  text: string
  completed: boolean
  priority?: Priority
}

export interface ExtractedEntity {
  type: 'PERSON' | 'ORGANIZATION' | 'DATE' | 'LOCATION' | 'OTHER'
  value: string
  confidence: number
}

export interface DetectedSignal {
  type: 'URGENCY_KEYWORD' | 'DEADLINE' | 'RISK_INDICATOR' | 'SENTIMENT'
  value: string
  score: number
  context: string
}

// Chart data types
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface TimeSeriesDataPoint {
  date: string
  count: number
  cumulative?: number
}

// Filter types
export interface ItemFilters {
  status?: ItemStatus[]
  priority?: Priority[]
  category?: string[]
  search?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

// Export types
export type ExportFormat = 'CSV' | 'JSON'

export interface ExportOptions {
  format: ExportFormat
  includeAnalysis?: boolean
  includeAuditTrail?: boolean
}

// Assistant types
export interface AssistantQuery {
  question: string
  workspaceId: string
}

export interface AssistantResponse {
  answer: string
  citations: Citation[]
  confidence: number
}