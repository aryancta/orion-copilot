import { useQuery } from '@tanstack/react-query'

export function useAnalytics(workspaceId?: string) {
  return useQuery({
    queryKey: ['analytics', workspaceId],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (workspaceId) {
        searchParams.set('workspaceId', workspaceId)
      }
      
      const response = await fetch(`/api/analytics/summary?${searchParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000 // 30 seconds
  })
}