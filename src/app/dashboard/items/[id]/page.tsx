"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppShell } from '@/components/layout/app-shell'
import { ItemSummaryCard } from '@/components/item/item-summary-card'
import { ActionItemsList } from '@/components/item/action-items-list'
import { AuditTrail } from '@/components/item/audit-trail'
import { OriginalContentPanel } from '@/components/item/original-content-panel'
import { useItem, useResolveItem } from '@/hooks/use-workspace'

interface PageProps {
  params: { id: string }
}

export default function ItemDetailPage({ params }: PageProps) {
  const { data, isLoading } = useItem(params.id)
  const resolveItem = useResolveItem()
  const [isResolving, setIsResolving] = useState(false)

  const handleResolve = async () => {
    setIsResolving(true)
    try {
      await resolveItem.mutateAsync({ 
        itemId: params.id,
        resolutionNote: 'Marked as resolved from item detail page' 
      })
    } catch (error) {
      console.error('Failed to resolve item:', error)
    } finally {
      setIsResolving(false)
    }
  }

  const handleExport = () => {
    if (!data?.item) return
    
    const exportData = {
      item: data.item,
      analysis: data.item.analysis,
      auditTrail: data.auditTrail,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex flex-1 flex-col space-y-6 p-6">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 bg-muted animate-pulse rounded" />
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-muted animate-pulse rounded-lg" />
              <div className="h-96 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-muted animate-pulse rounded-lg" />
              <div className="h-48 bg-muted animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!data?.item) {
    return (
      <AppShell>
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Item not found</h1>
            <p className="text-muted-foreground">The requested item could not be found.</p>
            <Button asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  const { item, auditTrail } = data
  const analysis = item.analysis

  return (
    <AppShell>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Item Analysis</h1>
              <p className="text-muted-foreground">Detailed analysis and insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            {item.status === 'COMPLETED' && (
              <Button
                onClick={handleResolve}
                disabled={isResolving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isResolving ? (
                  'Resolving...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Resolved
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ItemSummaryCard item={item} analysis={analysis} />
            
            {analysis?.actionItems && (
              <ActionItemsList 
                actionItems={JSON.parse(analysis.actionItems)} 
              />
            )}
            
            <OriginalContentPanel 
              content={{
                rawContent: item.rawContent,
                extractedText: item.extractedText,
                sourceType: item.sourceType,
                filename: item.filename || undefined,
                mimeType: item.mimeType || undefined
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Entities */}
            {analysis?.entities && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Extracted Entities</h3>
                <div className="space-y-2">
                  {JSON.parse(analysis.entities).slice(0, 8).map((entity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{entity.value}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{entity.type}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(entity.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <AuditTrail auditEvents={auditTrail} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}