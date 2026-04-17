"use client"

import { Clock, FileText, Brain, Target, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AuditEvent {
  id: string
  eventType: string
  message: string
  createdAt: string
  metadata: Record<string, any>
}

interface AuditTrailProps {
  auditEvents: AuditEvent[]
  className?: string
}

export function AuditTrail({ auditEvents, className }: AuditTrailProps) {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'uploaded': return FileText
      case 'extracted': return FileText
      case 'classified': return Brain
      case 'priority_scored': return Target
      case 'risk_assessed': return Shield
      case 'entities_extracted': return Brain
      case 'summarized': return CheckCircle
      case 'resolved': return CheckCircle
      default: return AlertCircle
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'uploaded': return 'text-blue-500'
      case 'extracted': return 'text-cyan-500'
      case 'classified': return 'text-purple-500'
      case 'priority_scored': return 'text-orange-500'
      case 'risk_assessed': return 'text-red-500'
      case 'entities_extracted': return 'text-indigo-500'
      case 'summarized': return 'text-green-500'
      case 'resolved': return 'text-emerald-500'
      default: return 'text-muted-foreground'
    }
  }

  const formatMetadata = (metadata: Record<string, any>) => {
    const entries = Object.entries(metadata).filter(([key, value]) => 
      key !== 'timestamp' && value !== null && value !== undefined
    )
    
    return entries.map(([key, value]) => {
      let displayValue = value
      
      if (typeof value === 'object' && value !== null) {
        displayValue = JSON.stringify(value, null, 2)
      } else if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No'
      } else if (typeof value === 'number' && key.includes('confidence')) {
        displayValue = `${Math.round(value * 100)}%`
      }

      return { key, value: displayValue }
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Decision Audit Trail
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Transparent log of all AI decisions and processing steps
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auditEvents.map((event, index) => {
            const IconComponent = getEventIcon(event.eventType)
            const iconColor = getEventColor(event.eventType)
            const metadata = formatMetadata(event.metadata)
            
            return (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index < auditEvents.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
                )}
                
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background",
                    iconColor.replace('text-', 'border-')
                  )}>
                    <IconComponent className={cn("h-4 w-4", iconColor)} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium leading-none">{event.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(new Date(event.createdAt))}
                        </p>
                      </div>
                    </div>
                    
                    {/* Metadata */}
                    {metadata.length > 0 && (
                      <Accordion type="single" collapsible className="mt-2">
                        <AccordionItem value={event.id} className="border-none">
                          <AccordionTrigger className="py-2 text-xs hover:no-underline">
                            View Technical Details ({metadata.length} items)
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="bg-muted/30 rounded-md p-3 space-y-2">
                              {metadata.map(({ key, value }) => (
                                <div key={key} className="flex items-start justify-between text-xs">
                                  <span className="font-medium text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:
                                  </span>
                                  <span className="text-right max-w-[60%] font-mono">
                                    {typeof value === 'string' && value.length > 100 ? (
                                      <details className="cursor-pointer">
                                        <summary className="hover:text-foreground">
                                          {value.substring(0, 50)}...
                                        </summary>
                                        <pre className="mt-2 whitespace-pre-wrap break-words">
                                          {value}
                                        </pre>
                                      </details>
                                    ) : (
                                      <span>{String(value)}</span>
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}