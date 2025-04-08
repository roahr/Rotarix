"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Analytics</h1>
        <p className="text-muted-foreground">View security metrics and analytics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Analytics Dashboard</CardTitle>
          <CardDescription>Comprehensive security metrics and trends</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="flex flex-col items-center text-center">
            <BarChart3 className="h-16 w-16 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              View detailed security metrics, trends, and insights to improve your security posture.
            </p>
            <Button>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

