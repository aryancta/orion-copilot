/**
 * Priority and risk scoring utilities
 * Provides consistent scoring logic across the application
 */

import { Priority, RiskLevel } from './types'

/**
 * Convert numeric priority score to priority level
 */
export function scoreToPriority(score: number): Priority {
  if (score >= 85) return 'CRITICAL'
  if (score >= 70) return 'HIGH' 
  if (score >= 40) return 'MEDIUM'
  return 'LOW'
}

/**
 * Convert numeric risk score to risk level
 */
export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'HIGH'
  if (score >= 40) return 'MEDIUM'
  return 'LOW'
}

/**
 * Convert priority level to numeric score
 */
export function priorityToScore(priority: Priority): number {
  switch (priority) {
    case 'CRITICAL': return 95
    case 'HIGH': return 80
    case 'MEDIUM': return 55
    case 'LOW': return 25
  }
}

/**
 * Convert risk level to numeric score
 */
export function riskLevelToScore(riskLevel: RiskLevel): number {
  switch (riskLevel) {
    case 'HIGH': return 80
    case 'MEDIUM': return 50
    case 'LOW': return 20
  }
}

/**
 * Get color class for priority
 */
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'CRITICAL': return 'text-red-400'
    case 'HIGH': return 'text-orange-400'
    case 'MEDIUM': return 'text-yellow-400'
    case 'LOW': return 'text-slate-400'
  }
}

/**
 * Get color class for risk level
 */
export function getRiskColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'HIGH': return 'text-red-400'
    case 'MEDIUM': return 'text-yellow-400'  
    case 'LOW': return 'text-green-400'
  }
}

/**
 * Calculate estimated time saved based on analysis complexity
 */
export function calculateTimeSaved(
  wordCount: number,
  actionItemsCount: number,
  entitiesCount: number
): number {
  // Base time savings for automated processing
  let minutes = 15 // Base 15 minutes for manual analysis
  
  // Add time based on content complexity
  minutes += Math.min(wordCount / 100, 30) // Up to 30 min for long documents
  minutes += actionItemsCount * 2 // 2 min per action item identification
  minutes += entitiesCount * 1 // 1 min per entity extraction
  
  return Math.round(minutes)
}