"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/sidebar-provider"
import { AlertTriangle, BarChart3, FileText, Key, LayoutDashboard, Lock, Settings, Shield, Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Key Management",
    href: "/keys",
    icon: Key,
  },
  {
    title: "Audit Logs",
    href: "/audit",
    icon: FileText,
  },
  {
    title: "Security Alerts",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "User Management",
    href: "/users",
    icon: Users,
  },
  {
    title: "Access Control",
    href: "/access",
    icon: Lock,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isOpen } = useSidebar()

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col overflow-y-auto border-r bg-background">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-500" />
            {isOpen && <span className="ml-2 text-lg font-bold">Rotarix</span>}
          </Link>
        </div>
        <div className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return isOpen ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ) : (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent text-accent-foreground" : "transparent",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-4">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className={cn("rounded-md bg-blue-500/10 p-3", !isOpen && "flex justify-center")}>
            {isOpen ? (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-blue-500">Security Status</h4>
                <p className="text-xs text-muted-foreground">System is secure</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-1.5 w-4/5 rounded-full bg-blue-500"></div>
                </div>
              </div>
            ) : (
              <div className="h-1.5 w-6 rounded-full bg-muted">
                <div className="h-1.5 w-4/5 rounded-full bg-blue-500"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

