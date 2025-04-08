"use client"

import { useState } from "react"
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Key,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const securityScoreData = [
  { name: "Jan", score: 78 },
  { name: "Feb", score: 82 },
  { name: "Mar", score: 85 },
  { name: "Apr", score: 79 },
  { name: "May", score: 88 },
  { name: "Jun", score: 92 },
  { name: "Jul", score: 94 },
]

const threatData = [
  { name: "Mon", threats: 4 },
  { name: "Tue", threats: 7 },
  { name: "Wed", threats: 5 },
  { name: "Thu", threats: 12 },
  { name: "Fri", threats: 8 },
  { name: "Sat", threats: 3 },
  { name: "Sun", threats: 2 },
]

const keyDistributionData = [
  { name: "AES-256", value: 45 },
  { name: "RSA-4096", value: 30 },
  { name: "Kyber-1024", value: 15 },
  { name: "Other", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const recentAlerts = [
  {
    id: "alert-1",
    title: "Unusual Login Attempt",
    description: "Multiple failed login attempts from IP 192.168.1.105",
    severity: "high",
    time: "10 minutes ago",
  },
  {
    id: "alert-2",
    title: "Key Rotation Required",
    description: "RSA-4096 key pair approaching rotation deadline",
    severity: "medium",
    time: "2 hours ago",
  },
  {
    id: "alert-3",
    title: "System Update Available",
    description: "Security patch KB123456 is available for installation",
    severity: "low",
    time: "1 day ago",
  },
]

const upcomingRotations = [
  {
    id: "key-1",
    name: "API Gateway Key",
    type: "AES-256",
    lastRotated: "2023-12-15",
    nextRotation: "2024-03-15",
    status: "upcoming",
  },
  {
    id: "key-2",
    name: "User Authentication",
    type: "RSA-4096",
    lastRotated: "2023-11-20",
    nextRotation: "2024-02-20",
    status: "urgent",
  },
  {
    id: "key-3",
    name: "Database Encryption",
    type: "Kyber-1024",
    lastRotated: "2024-01-05",
    nextRotation: "2024-04-05",
    status: "healthy",
  },
]

export default function DashboardPage() {
  const [securityScore, setSecurityScore] = useState(92)
  const [selectedKey, setSelectedKey] = useState<typeof upcomingRotations[0] | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<typeof recentAlerts[0] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your security posture, manage cryptographic keys, and respond to threats
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityScore}/100</div>
            <Progress value={securityScore} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">+4 from last assessment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Key className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="mt-2 text-xs text-muted-foreground">3 keys require rotation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="mt-2 text-xs text-muted-foreground">2 high severity threats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Secure</div>
            <p className="mt-2 text-xs text-muted-foreground">Last scan: 10 minutes ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Security Score Trend</CardTitle>
            <CardDescription>System security score over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={securityScoreData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[50, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Threat Detection</CardTitle>
            <CardDescription>Number of threats detected in the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={threatData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="threats" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Key Rotation Status</CardTitle>
            <CardDescription>Upcoming key rotations and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last Rotated</TableHead>
                  <TableHead>Next Rotation</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingRotations.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0 h-auto font-medium" onClick={() => setSelectedKey(key)}>
                            {key.name}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Key Details</DialogTitle>
                            <DialogDescription>Detailed information about {key.name}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Key Type</span>
                              <span className="col-span-3">{key.type}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Last Rotated</span>
                              <span className="col-span-3">{key.lastRotated}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Next Rotation</span>
                              <span className="col-span-3">{key.nextRotation}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Status</span>
                              <span className="col-span-3">
                                <Badge
                                  variant={
                                    key.status === "urgent" ? "destructive" : key.status === "upcoming" ? "secondary" : "default"
                                  }
                                >
                                  {key.status === "urgent" && <Clock className="mr-1 h-3 w-3" />}
                                  {key.status === "upcoming" && <RefreshCw className="mr-1 h-3 w-3" />}
                                  {key.status === "healthy" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                  {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                                </Badge>
                              </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Created</span>
                              <span className="col-span-3">2023-09-15</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Usage</span>
                              <span className="col-span-3">API Gateway Authentication</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Access</span>
                              <span className="col-span-3">Admin, Security Team</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>{key.type}</TableCell>
                    <TableCell>{key.lastRotated}</TableCell>
                    <TableCell>{key.nextRotation}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          key.status === "urgent" ? "destructive" : key.status === "upcoming" ? "secondary" : "default"
                        }
                      >
                        {key.status === "urgent" && <Clock className="mr-1 h-3 w-3" />}
                        {key.status === "upcoming" && <RefreshCw className="mr-1 h-3 w-3" />}
                        {key.status === "healthy" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/keys'}>
              View All Keys
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Distribution</CardTitle>
            <CardDescription>Types of cryptographic keys in use</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={keyDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {keyDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Alerts</CardTitle>
            <CardDescription>Latest security events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.title}</TableCell>
                    <TableCell>{alert.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "secondary" : "default"
                        }
                      >
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.time}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(alert)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Alert Details</DialogTitle>
                            <DialogDescription>Detailed information about the security alert</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Title</span>
                              <span className="col-span-3">{alert.title}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Description</span>
                              <span className="col-span-3">{alert.description}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Severity</span>
                              <span className="col-span-3">
                                <Badge
                                  variant={
                                    alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "secondary" : "default"
                                  }
                                >
                                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                                </Badge>
                              </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Time</span>
                              <span className="col-span-3">{alert.time}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Source</span>
                              <span className="col-span-3">Security Monitoring System</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Status</span>
                              <span className="col-span-3">Active</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Recommended Action</span>
                              <span className="col-span-3">Review system logs and update security policies</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="ml-auto">
              View All Alerts
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

