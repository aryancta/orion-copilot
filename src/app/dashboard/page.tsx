"use client"

import { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { UploadPanel } from '@/components/dashboard/upload-panel'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { ItemsTable } from '@/components/dashboard/items-table'
import { useWorkspaces, useWorkspaceItems } from '@/hooks/use-workspace'
import { useAppStore } from '@/store/app-store'

export default function DashboardPage() {
  const { data: workspacesData } = useWorkspaces()
  const { activeWorkspace, setActiveWorkspace } = useAppStore()
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('')

  // Set active workspace on initial load
  useEffect(() => {
    if (workspacesData?.workspaces?.length > 0 && !activeWorkspace) {
      const defaultWorkspace = workspacesData.workspaces[0]
      setActiveWorkspace({
        id: defaultWorkspace.id,
        name: defaultWorkspace.name,
        type: defaultWorkspace.type
      })
      setCurrentWorkspaceId(defaultWorkspace.id)
    } else if (activeWorkspace) {
      setCurrentWorkspaceId(activeWorkspace.id)
    }
  }, [workspacesData, activeWorkspace, setActiveWorkspace])

  const { data: itemsData, isLoading: itemsLoading } = useWorkspaceItems(
    currentWorkspaceId,
    { limit: '20' }
  )

  const metrics = itemsData?.metrics || {
    totalItems: 0,
    urgentItems: 0,
    resolvedItems: 0,
    estimatedTimeSaved: 0
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              {activeWorkspace ? (
                `Manage items for ${activeWorkspace.name}`
              ) : (
                'Upload documents and manage your workflow'
              )}
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards metrics={metrics} isLoading={itemsLoading} />

        {/* Upload Panel */}
        {currentWorkspaceId && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <UploadPanel workspaceId={currentWorkspaceId} />
          </div>
        )}

        {/* Recent Items */}
        <div>
          <ItemsTable 
            items={itemsData?.items || []} 
            isLoading={itemsLoading} 
          />
        </div>
      </div>
    </AppShell>
  )
}