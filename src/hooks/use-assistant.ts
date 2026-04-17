import { useMutation, useQuery } from '@tanstack/react-query'

export function useAssistantQuery() {
  return useMutation({
    mutationFn: async ({ workspaceId, question }: { 
      workspaceId: string
      question: string 
    }) => {
      const response = await fetch('/api/assistant/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ workspaceId, question })
      })

      if (!response.ok) {
        throw new Error('Failed to get assistant response')
      }

      return response.json()
    }
  })
}