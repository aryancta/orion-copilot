"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  Bot, 
  FileText, 
  Home, 
  LayoutDashboard, 
  Settings,
  Zap 
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Main workspace and items"
  },
  {
    name: "Analytics", 
    href: "/analytics",
    icon: BarChart3,
    description: "Impact metrics and trends"
  },
  {
    name: "Assistant",
    href: "/assistant", 
    icon: Bot,
    description: "Workspace Q&A"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Configuration and demo controls"
  }
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo and Brand */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold">Orion Copilot</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-4 w-4 flex-shrink-0",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="font-medium text-foreground mb-1">Built by Aryan Choudhary</div>
          <div>Hackathon Project 2024</div>
        </div>
      </div>
    </div>
  )
}