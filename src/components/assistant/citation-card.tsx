"use client"

import Link from 'next/link'
import { ExternalLink, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Citation {
  itemId: string
  title: string
  excerpt: string
  confidence: number
}

interface CitationCardProps {
  citations: Citation[]
}

export function CitationCard({ citations }: CitationCardProps) {
  if (citations.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground">
        Sources ({citations.length})
      </div>
      
      <div className="space-y-2">
        {citations.map((citation, index) => (
          <Card key={citation.itemId} className="border-border/50">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 flex-shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none mb-1 truncate">
                        {citation.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {citation.excerpt}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      asChild
                    >
                      <Link href={`/dashboard/items/${citation.itemId}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      Source {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(citation.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}