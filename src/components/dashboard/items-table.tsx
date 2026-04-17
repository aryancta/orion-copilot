"use client"

import { useState } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Eye, CheckCircle, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ItemStatusBadge } from './item-status-badge'
import { PriorityBadge } from './priority-badge'
import { useResolveItem } from '@/hooks/use-workspace'
import { formatRelativeTime, truncateText } from '@/lib/utils'
import { ItemStatus, Priority } from '@/lib/types'

interface Item {
  id: string
  title: string
  category?: string
  status: ItemStatus
  priority?: Priority
  summary?: string
  createdAt: string
  sourceType: 'FILE' | 'TEXT'
  filename?: string
}

interface ItemsTableProps {
  items: Item[]
  isLoading?: boolean
}

export function ItemsTable({ items, isLoading }: ItemsTableProps) {
  const resolveItem = useResolveItem()
  const [resolvingItems, setResolvingItems] = useState<Set<string>>(new Set())

  const handleResolveItem = async (itemId: string) => {
    setResolvingItems(prev => new Set(prev).add(itemId))
    try {
      await resolveItem.mutateAsync({ itemId })
    } catch (error) {
      console.error('Failed to resolve item:', error)
    } finally {
      setResolvingItems(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="flex-1 h-4 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No items yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload a document or paste some text to get started
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Items ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="group">
                <TableCell>
                  <div className="space-y-1">
                    <Link
                      href={`/dashboard/items/${item.id}`}
                      className="font-medium hover:underline text-foreground group-hover:text-primary"
                    >
                      {truncateText(item.title, 60)}
                    </Link>
                    {item.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {truncateText(item.summary, 100)}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      {item.sourceType === 'FILE' ? (
                        <span>{item.filename || 'Uploaded file'}</span>
                      ) : (
                        <span>Text input</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {item.category ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                      {item.category}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <ItemStatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  {item.priority ? (
                    <PriorityBadge priority={item.priority} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatRelativeTime(new Date(item.createdAt))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <Link href={`/dashboard/items/${item.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    {item.status === 'COMPLETED' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleResolveItem(item.id)}
                        disabled={resolvingItems.has(item.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}