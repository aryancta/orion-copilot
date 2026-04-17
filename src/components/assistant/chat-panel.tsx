"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { CitationCard } from './citation-card'
import { useAssistantQuery } from '@/hooks/use-assistant'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  citations?: any[]
  confidence?: number
}

interface ChatPanelProps {
  workspaceId: string
  className?: string
}

export function ChatPanel({ workspaceId, className }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your workspace assistant. I can help you find information about your documents, analyze trends, and answer questions about your workflow. What would you like to know?",
      timestamp: new Date(),
      confidence: 1.0
    }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const assistantQuery = useAssistantQuery()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || !workspaceId || assistantQuery.isPending) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const response = await assistantQuery.mutateAsync({
        workspaceId,
        question: input.trim()
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        citations: response.citations,
        confidence: response.confidence
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Assistant query failed:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error while processing your question. Please try again or rephrase your question.",
        timestamp: new Date(),
        confidence: 0.5
      }

      setMessages(prev => [...prev, errorMessage])
    }

    // Refocus input
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.type === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.type === 'assistant' && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            
            <div className={cn(
              "max-w-[80%] space-y-2",
              message.type === 'user' ? "items-end" : "items-start"
            )}>
              <Card className={cn(
                "border-border/50",
                message.type === 'user' 
                  ? "bg-primary/10 border-primary/20" 
                  : "bg-card"
              )}>
                <CardContent className="p-3">
                  <div className="text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  {message.confidence && message.type === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        message.confidence > 0.8 ? "bg-green-500" :
                        message.confidence > 0.6 ? "bg-yellow-500" : "bg-red-500"
                      )} />
                      <span>{Math.round(message.confidence * 100)}% confidence</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {message.citations && message.citations.length > 0 && (
                <CitationCard citations={message.citations} />
              )}
            </div>
            
            {message.type === 'user' && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        
        {assistantQuery.isPending && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <Card className="border-border/50 bg-card">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card/50">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your workspace items, priorities, or trends..."
            disabled={assistantQuery.isPending}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || assistantQuery.isPending}
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}