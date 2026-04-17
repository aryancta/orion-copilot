"use client"

import { useState } from 'react'
import { RefreshCw, Database, Palette, Zap, Building, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppShell } from '@/components/layout/app-shell'
import { useAppStore } from '@/store/app-store'
import { useQueryClient } from '@tanstack/react-query'

export default function SettingsPage() {
  const [isResetting, setIsResetting] = useState(false)
  const { activeWorkspace, setActiveWorkspace, theme, setTheme } = useAppStore()
  const queryClient = useQueryClient()

  const handleDemoReset = async (scenario: 'ENTERPRISE' | 'EDUCATION') => {
    setIsResetting(true)
    
    try {
      const response = await fetch('/api/demo/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ scenario })
      })

      if (!response.ok) {
        throw new Error('Reset failed')
      }

      const data = await response.json()
      
      // Update active workspace
      setActiveWorkspace({
        id: data.workspaceId,
        name: scenario === 'ENTERPRISE' ? 'Acme Corp Operations' : 'University Administration',
        type: scenario
      })

      // Invalidate all queries to refresh data
      queryClient.invalidateQueries()
      
      alert(`Demo reset successful! Switched to ${scenario.toLowerCase()} scenario.`)
    } catch (error) {
      console.error('Demo reset failed:', error)
      alert('Demo reset failed. Please try again.')
    } finally {
      setIsResetting(false)
    }
  }

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col space-y-8 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your workspace and demo options
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demo Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>Demo Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Reset to Scenario</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a demo scenario to showcase different use cases
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => handleDemoReset('ENTERPRISE')}
                    disabled={isResetting}
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium">Enterprise Operations</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Support tickets, security alerts, and budget requests
                        </div>
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={() => handleDemoReset('EDUCATION')}
                    disabled={isResetting}
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                  >
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium">University Administration</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Student appeals, facility requests, and academic processes
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current scenario:</span>
                  <span className="font-medium">
                    {activeWorkspace?.type || 'None'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Appearance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Theme</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your preferred color scheme
                </p>
                
                <Button
                  onClick={handleThemeToggle}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'}`} />
                    <span className="text-xs text-muted-foreground">
                      {theme === 'dark' ? 'Current' : 'Current'}
                    </span>
                  </div>
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Preview</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-8 bg-background border rounded"></div>
                  <div className="h-8 bg-card border rounded"></div>
                  <div className="h-8 bg-primary rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Processing Mode</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose analysis speed vs. accuracy tradeoff
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Fast Mode</div>
                      <div className="text-xs text-muted-foreground">
                        Quick analysis, good for high volume
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                    <div>
                      <div className="font-medium text-sm">Deep Mode</div>
                      <div className="text-xs text-muted-foreground">
                        Thorough analysis, slower processing
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-muted"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About Orion Copilot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Built by</span>
                  <span className="font-medium">Aryan Choudhary</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Project</span>
                  <span className="font-medium">Hackathon 2024</span>
                </div>
              </div>
              
              <div className="pt-4 border-t text-xs text-muted-foreground">
                <p>
                  AI-powered workflow assistant that transforms unstructured documents 
                  into actionable insights and clear next steps.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reset Status */}
        {isResetting && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Resetting demo data...</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}