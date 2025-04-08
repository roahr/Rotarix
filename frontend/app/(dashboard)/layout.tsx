"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/sidebar-provider"
import { MainNav } from "@/components/main-nav"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search } from "@/components/search"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isOpen, toggle, isMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)

  const notifications = [
    {
      id: "1",
      title: "Key Rotation Required",
      description: "API Gateway key needs rotation in 3 days",
      time: "5 mins ago",
      type: "warning",
    },
    {
      id: "2",
      title: "Successful Key Rotation",
      description: "Database encryption key rotated successfully",
      time: "1 hour ago",
      type: "success",
    },
    {
      id: "3",
      title: "Failed Access Attempt",
      description: "Multiple failed attempts to access key vault",
      time: "2 hours ago",
      type: "error",
    },
    {
      id: "4",
      title: "New Key Created",
      description: "New symmetric key created for payment service",
      time: "1 day ago",
      type: "info",
    },
  ]

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="mr-4 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <DashboardSidebar />
              </SheetContent>
            </Sheet>
          ) : (
            <Button variant="outline" size="icon" className="mr-4 hidden md:flex" onClick={toggle}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge
                    variant="secondary"
                    className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {notifications.length}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                    <div className="flex w-full items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <Badge
                        variant={
                          notification.type === "success"
                            ? "default"
                            : notification.type === "warning"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        {!isMobile && (
          <aside
            className={`w-72 border-r bg-background transition-all duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
            }`}
          >
            <DashboardSidebar />
          </aside>
        )}
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

