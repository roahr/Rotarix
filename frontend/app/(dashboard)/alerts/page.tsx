"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Bell,
  Check,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  X,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const alerts = [
  {
    id: "alert-1",
    title: "Unusual Login Attempt",
    description: "Multiple failed login attempts from IP 192.168.1.105",
    severity: "high",
    time: "10 minutes ago",
    status: "active",
    source: "Authentication System",
    category: "Authentication",
    riskScore: 85,
  },
  {
    id: "alert-2",
    title: "Key Rotation Required",
    description: "RSA-4096 key pair approaching rotation deadline",
    severity: "medium",
    time: "2 hours ago",
    status: "active",
    source: "Key Management System",
    category: "Key Lifecycle",
    riskScore: 65,
  },
  {
    id: "alert-3",
    title: "System Update Available",
    description: "Security patch KB123456 is available for installation",
    severity: "low",
    time: "1 day ago",
    status: "active",
    source: "System Monitor",
    category: "System",
    riskScore: 40,
  },
  {
    id: "alert-4",
    title: "Unusual API Access Pattern",
    description: "Abnormal number of API requests from authorized user",
    severity: "medium",
    time: "30 minutes ago",
    status: "investigating",
    source: "API Gateway",
    category: "API Security",
    riskScore: 72,
  },
  {
    id: "alert-5",
    title: "Database Encryption Key Access",
    description: "Unexpected access to database encryption key outside maintenance window",
    severity: "high",
    time: "45 minutes ago",
    status: "investigating",
    source: "Key Management System",
    category: "Key Access",
    riskScore: 88,
  },
  {
    id: "alert-6",
    title: "Failed Certificate Validation",
    description: "TLS certificate validation failed for external service connection",
    severity: "high",
    time: "15 minutes ago",
    status: "active",
    source: "Network Monitor",
    category: "Network Security",
    riskScore: 90,
  },
  {
    id: "alert-7",
    title: "Quantum Resistance Test Failure",
    description: "Post-quantum algorithm test failed during scheduled validation",
    severity: "medium",
    time: "3 hours ago",
    status: "resolved",
    source: "Cryptographic Validation",
    category: "Cryptography",
    riskScore: 60,
  },
  {
    id: "alert-8",
    title: "User Permission Change",
    description: "Elevated permissions granted to user account outside change window",
    severity: "medium",
    time: "5 hours ago",
    status: "resolved",
    source: "Access Control System",
    category: "Access Control",
    riskScore: 70,
  },
]

const threatData = [
  { name: "Jan", threats: 24, mitigated: 22 },
  { name: "Feb", threats: 18, mitigated: 17 },
  { name: "Mar", threats: 29, mitigated: 25 },
  { name: "Apr", threats: 32, mitigated: 30 },
  { name: "May", threats: 25, mitigated: 24 },
  { name: "Jun", threats: 35, mitigated: 31 },
  { name: "Jul", threats: 42, mitigated: 38 },
]

const severityDistribution = [
  { name: "High", value: 35 },
  { name: "Medium", value: 45 },
  { name: "Low", value: 20 },
]

const COLORS = ["#ef4444", "#f97316", "#3b82f6"]

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Alerts</h1>
        <p className="text-muted-foreground">Monitor and respond to security incidents and AI-detected threats</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="mt-2 text-xs text-muted-foreground">3 high severity alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72/100</div>
            <Progress value={72} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">+5 from last assessment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mitigated Today</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="mt-2 text-xs text-muted-foreground">92% resolution rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Detection Status</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="mt-2 text-xs text-muted-foreground">Last scan: 2 minutes ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                High Severity
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                Medium Severity
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertTriangle className="mr-2 h-4 w-4 text-blue-500" />
                Low Severity
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Clock className="mr-2 h-4 w-4" />
                Last 24 Hours
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alert Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="investigating">Investigating</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4 space-y-4">
          {filteredAlerts
            .filter((alert) => alert.status === "active")
            .map((alert) => (
              <Alert
                key={alert.id}
                variant={
                  alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "outline"
                }
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  {alert.title}
                  <Badge
                    variant={
                      alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "outline"
                    }
                    className="ml-2"
                  >
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <p>{alert.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{alert.time}</span>
                      <span className="text-muted-foreground">Source: {alert.source}</span>
                      <span className="text-muted-foreground">Category: {alert.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8">
                        <Eye className="mr-1 h-3 w-3" />
                        Details
                      </Button>
                      <Button size="sm" className="h-8">
                        <Check className="mr-1 h-3 w-3" />
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
        </TabsContent>
        <TabsContent value="investigating" className="mt-4 space-y-4">
          {filteredAlerts
            .filter((alert) => alert.status === "investigating")
            .map((alert) => (
              <Alert
                key={alert.id}
                variant={
                  alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "outline"
                }
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  {alert.title}
                  <Badge
                    variant={
                      alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "outline"
                    }
                    className="ml-2"
                  >
                    {alert.severity}
                  </Badge>
                  <Badge variant="outline" className="ml-2">
                    Investigating
                  </Badge>
                </AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <p>{alert.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{alert.time}</span>
                      <span className="text-muted-foreground">Source: {alert.source}</span>
                      <span className="text-muted-foreground">Category: {alert.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8">
                        <Eye className="mr-1 h-3 w-3" />
                        Details
                      </Button>
                      <Button size="sm" className="h-8">
                        <Check className="mr-1 h-3 w-3" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
        </TabsContent>
        <TabsContent value="resolved" className="mt-4 space-y-4">
          {filteredAlerts
            .filter((alert) => alert.status === "resolved")
            .map((alert) => (
              <Alert key={alert.id} variant="outline">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle className="flex items-center gap-2">
                  {alert.title}
                  <Badge variant="outline" className="ml-2">
                    Resolved
                  </Badge>
                </AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <p>{alert.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{alert.time}</span>
                      <span className="text-muted-foreground">Source: {alert.source}</span>
                      <span className="text-muted-foreground">Category: {alert.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8">
                        <Eye className="mr-1 h-3 w-3" />
                        Details
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Reopen
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Threat Trend Analysis</CardTitle>
            <CardDescription>Security incidents detected and mitigated over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
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
                <Legend />
                <Area
                  type="monotone"
                  dataKey="threats"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.2}
                  name="Detected"
                />
                <Area
                  type="monotone"
                  dataKey="mitigated"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.2}
                  name="Mitigated"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Alert Severity Distribution</CardTitle>
            <CardDescription>Breakdown of current alerts by severity level</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {severityDistribution.map((entry, index) => (
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

      <Card>
        <CardHeader>
          <CardTitle>Alert Details</CardTitle>
          <CardDescription>Comprehensive information about the selected security alert</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Unusual Login Attempt</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">High Severity</Badge>
                  <Badge variant="outline">Authentication</Badge>
                  <span className="text-sm text-muted-foreground">10 minutes ago</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View in SIEM
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <X className="mr-2 h-4 w-4" />
                      Dismiss Alert
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-medium">Description</h3>
                <p className="text-sm">
                  Multiple failed login attempts detected from IP address 192.168.1.105. The system observed 12 failed
                  attempts within a 5-minute window, exceeding the threshold of 5 attempts. The login attempts targeted
                  the admin account with various password combinations, suggesting a brute force attack.
                </p>

                <h3 className="mb-2 mt-4 text-sm font-medium">AI Analysis</h3>
                <p className="text-sm">
                  The pattern of login attempts matches known brute force attack signatures. The source IP has no
                  previous history of accessing the system and is originating from an unusual geographic location.
                  Recommend immediate investigation and potential IP blocking.
                </p>

                <h3 className="mb-2 mt-4 text-sm font-medium">Recommended Actions</h3>
                <ul className="ml-4 list-disc text-sm [&>li]:mt-1">
                  <li>Temporarily lock the targeted account</li>
                  <li>Block the source IP address</li>
                  <li>Enable additional MFA requirements</li>
                  <li>Review recent account activity for signs of compromise</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Event Timeline</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="absolute bottom-0 left-1/2 top-2 w-px -translate-x-1/2 bg-muted"></div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium">10:32:45 AM</div>
                      <div className="text-xs">First failed login attempt detected</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <div className="absolute bottom-0 left-1/2 top-2 w-px -translate-x-1/2 bg-muted"></div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium">10:34:12 AM</div>
                      <div className="text-xs">5 failed attempts threshold exceeded</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="absolute bottom-0 left-1/2 top-2 w-px -translate-x-1/2 bg-muted"></div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium">10:37:30 AM</div>
                      <div className="text-xs">AI detection identified brute force pattern</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium">10:38:05 AM</div>
                      <div className="text-xs">Alert generated and notifications sent</div>
                    </div>
                  </div>
                </div>

                <h3 className="mb-2 mt-4 text-sm font-medium">Technical Details</h3>
                <div className="rounded-md bg-muted p-3">
                  <div className="space-y-1 text-xs">
                    <div className="grid grid-cols-3">
                      <span className="font-medium">Source IP:</span>
                      <span className="col-span-2">192.168.1.105</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="font-medium">Geolocation:</span>
                      <span className="col-span-2">Unknown (VPN detected)</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="font-medium">Target Account:</span>
                      <span className="col-span-2">admin@example.com</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="font-medium">Attempt Count:</span>
                      <span className="col-span-2">12 in 5 minutes</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="font-medium">User Agent:</span>
                      <span className="col-span-2 break-all">
                        Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="mb-2 mt-4 text-sm font-medium">Risk Assessment</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="text-sm font-medium">85/100</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline">
              <Siren className="mr-2 h-4 w-4" />
              Escalate
            </Button>
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View in SIEM
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" />
              Dismiss
            </Button>
            <Button>
              <Check className="mr-2 h-4 w-4" />
              Resolve
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

