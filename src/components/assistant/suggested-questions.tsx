"use client"

import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'

interface SuggestedQuestionsProps {
  onQuestionSelect: (question: string) => void
  workspaceType?: 'ENTERPRISE' | 'EDUCATION'
}

export function SuggestedQuestions({ onQuestionSelect, workspaceType }: SuggestedQuestionsProps) {
  const enterpriseQuestions = [
    "What are the most critical issues this week?",
    "Show me all budget requests pending approval",
    "What security alerts need immediate attention?",
    "How many customer escalations are unresolved?",
    "What's our current processing rate?",
    "Which items have been resolved recently?"
  ]

  const educationQuestions = [
    "What student support cases need immediate attention?",
    "Show me all academic appeals in progress",
    "What facility requests are pending?",
    "How many items require faculty review?",
    "What's the current resolution status?",
    "Which categories have the most items?"
  ]

  const questions = workspaceType === 'EDUCATION' ? educationQuestions : enterpriseQuestions

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <HelpCircle className="h-4 w-4" />
        <span>Suggested questions</span>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="text-left h-auto p-3 text-sm justify-start whitespace-normal"
            onClick={() => onQuestionSelect(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}