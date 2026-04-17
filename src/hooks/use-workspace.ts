import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'

interface Workspace {
  id: string
  name: string
  description?: string
  type: 'ENTERPRISE' | 'EDUCATION'
  _count?: {
    items: number
    questions: number
  }
}

export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await fetch('/api/workspaces')
      if (!response.ok) {
        throw new Error('Failed to fetch workspaces')
      }
      return response.json()
    }
  })
}

export function useWorkspaceItems(workspaceId: string, filters?: Record<string, string>) {
  const searchParams = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.set(key, value)
    })
  }

  return useQuery({
    queryKey: ['workspace-items', workspaceId, filters],
    queryFn: async () => {
      const url = `/api/workspaces/${workspaceId}/items?${searchParams.toString()}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch workspace items')
      }
      return response.json()
    },
    enabled: !!workspaceId
  })
}

export function useCreateItem(workspaceId: string) {
  const queryClient = useQueryClient()
  const { setIsUploading } = useAppStore()

  return useMutation({
    mutationFn: async (data: {
      sourceType: 'FILE' | 'TEXT'
      filename?: string
      content: string
      mimeType?: string
    }) => {
      setIsUploading(true)
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          throw new Error('Failed to create item')
        }

        return response.json()
      } finally {
        setIsUploading(false)
      }
    },
    onSuccess: () => {
      // Invalidate and refetch workspace items
      queryClient.invalidateQueries({ queryKey: ['workspace-items', workspaceId] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    }
  })
}

export function useItem(itemId: string) {
  return useQuery({
    queryKey: ['item', itemId],
    queryFn: async () => {
      const response = await fetch(`/api/items/${itemId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch item')
      }
      return response.json()
    },
    enabled: !!itemId
  })
}

export function useResolveItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemId, resolutionNote }: { 
      itemId: string
      resolutionNote?: string 
    }) => {
      const response = await fetch(`/api/items/${itemId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resolutionNote })
      })

      if (!response.ok) {
        throw new Error('Failed to resolve item')
      }

      return response.json()
    },
    onSuccess: (_, { itemId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['item', itemId] })
      queryClient.invalidateQueries({ queryKey: ['workspace-items'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    }
  })
}