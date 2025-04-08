"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/sidebar-provider"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()
  const { isOpen } = useSidebar()

  return (
    <div className={cn("flex items-center", className)}>
      <Link href="/dashboard" className="flex items-center">
        <Shield className="h-6 w-6 text-blue-500" />
        <span className={cn("ml-2 text-lg font-bold", !isOpen && "md:hidden")}>Rotarix</span>
      </Link>
    </div>
  )
}

