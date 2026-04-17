"use client"

import { AppShell } from '@/components/layout/app-shell'
import { ChatPanel } from '@/components/assistant/chat-panel'
import { SuggestedQuestions } from '@/components/assistant/suggested-questions'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, MessageCircle, FileSearch, TrendingUp } from 'lucide-react'

export default function AssistantPage() {
  const { activeWorkspace } = useAppStore()

  if (!activeWorkspace) {
    return (
      <AppShell>
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto">
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No Workspace Selected</h2>
            <p className="text-muted-foreground">
              Please select a workspace to use the assistant
            </p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col lg:flex-row h-full">
        {/* Sidebar */}
        <div className="lg:w-80 p-6 border-r border-border bg-card/30">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Workspace Assistant</h1>
                  <p className="text-sm text-muted-foreground">
                    {activeWorkspace.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">What I can help with</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <FileSearch className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Find Information</div>
                    <div className="text-xs text-muted-foreground">
                      Search through your documents and summaries
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Analyze Trends</div>
                    <div className="text-xs text-muted-foreground">
                      Get insights about priorities and categories
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-sm">
                  <MessageCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Answer Questions</div>
                    <div className="text-xs text-muted-foreground">
                      Get contextual answers about your workspace
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Questions */}
            <SuggestedQuestions 
              workspaceType={activeWorkspace.type}
              onQuestionSelect={(question) => {
                // This will be handled by the ChatPanel component
                console.log('Selected question:', question)
              }}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatPanel 
            workspaceId={activeWorkspace.id}
            className="flex-1"
          />
        </div>
      </div>
    </AppShell>
  )
}