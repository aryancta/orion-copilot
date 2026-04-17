import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Workspace {
  id: string
  name: string
  type: 'ENTERPRISE' | 'EDUCATION'
}

interface AppState {
  // Current workspace
  activeWorkspace: Workspace | null
  setActiveWorkspace: (workspace: Workspace) => void
  
  // UI state
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Upload state
  isUploading: boolean
  setIsUploading: (uploading: boolean) => void
  
  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // Filters
  filters: {
    status: string[]
    priority: string[]
    category: string[]
  }
  setFilters: (filters: Partial<AppState['filters']>) => void
  clearFilters: () => void
  
  // Theme
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Workspace state
      activeWorkspace: null,
      setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
      
      // UI state
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      // Upload state
      isUploading: false,
      setIsUploading: (uploading) => set({ isUploading: uploading }),
      
      // Search state
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Filters
      filters: {
        status: [],
        priority: [],
        category: []
      },
      setFilters: (newFilters) => 
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),
      clearFilters: () => 
        set({
          filters: {
            status: [],
            priority: [],
            category: []
          }
        }),
      
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'orion-app-store',
      partialize: (state) => ({
        activeWorkspace: state.activeWorkspace,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme
      })
    }
  )
)