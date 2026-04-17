"use client"

import { useState } from 'react'
import { FileText, Copy, Download, Eye, EyeOff, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OriginalContentPanelProps {
  content: {
    rawContent: string
    extractedText: string
    sourceType: 'FILE' | 'TEXT'
    filename?: string
    mimeType?: string
  }
  className?: string
}

export function OriginalContentPanel({ content, className }: OriginalContentPanelProps) {
  const [viewMode, setViewMode] = useState<'raw' | 'extracted'>('extracted')
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleCopy = async () => {
    const textToCopy = viewMode === 'raw' ? content.rawContent : content.extractedText
    
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleDownload = () => {
    const textToDownload = viewMode === 'raw' ? content.rawContent : content.extractedText
    const filename = content.filename 
      ? `${content.filename.split('.')[0]}_${viewMode}.txt`
      : `content_${viewMode}.txt`
    
    const blob = new Blob([textToDownload], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const displayContent = viewMode === 'raw' ? content.rawContent : content.extractedText
  const wordCount = displayContent.split(/\s+/).filter(Boolean).length
  const charCount = displayContent.length
  
  // Handle base64 content for files
  const isBase64 = content.rawContent.startsWith('data:')
  const canShowRaw = !isBase64 || content.sourceType === 'TEXT'

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Original Content
          </CardTitle>
          <div className="flex items-center gap-2">
            {canShowRaw && (
              <div className="flex rounded-md border border-border p-1">
                <Button
                  variant={viewMode === 'extracted' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => setViewMode('extracted')}
                >
                  Extracted
                </Button>
                <Button
                  variant={viewMode === 'raw' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => setViewMode('raw')}
                >
                  Raw
                </Button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-7 px-2"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            {content.sourceType === 'FILE' ? (
              <>File: {content.filename || 'Unknown'}</>
            ) : (
              'Text Input'
            )}
          </span>
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          {content.mimeType && (
            <span>{content.mimeType}</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {!canShowRaw && viewMode === 'raw' ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Raw file content not displayable</p>
            <p className="text-xs mt-1">Binary file content cannot be shown as text</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Content Preview */}
            <div className={cn(
              "relative rounded-md border bg-muted/30 p-4 font-mono text-sm overflow-hidden",
              !expanded && "max-h-96"
            )}>
              <pre className="whitespace-pre-wrap break-words leading-relaxed">
                {expanded ? displayContent : displayContent.substring(0, 2000)}
                {!expanded && displayContent.length > 2000 && "..."}
              </pre>
              
              {!expanded && displayContent.length > 2000 && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/30 to-transparent" />
              )}
            </div>
            
            {/* Expand/Collapse Button */}
            {displayContent.length > 2000 && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className="gap-2"
                >
                  {expanded ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Show More ({(displayContent.length - 2000).toLocaleString()} more characters)
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* Content Analysis */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold">{wordCount}</div>
                <div className="text-xs text-muted-foreground">Words</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{charCount}</div>
                <div className="text-xs text-muted-foreground">Characters</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {displayContent.split('\n').length}
                </div>
                <div className="text-xs text-muted-foreground">Lines</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {Math.ceil(wordCount / 200)}
                </div>
                <div className="text-xs text-muted-foreground">Min Read</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}