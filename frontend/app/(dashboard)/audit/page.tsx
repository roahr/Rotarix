"use client"

import { useState } from "react"
import {
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Key,
  Search,
  Shield,
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

const auditLogs = [
  {
    id: "log-1",
    timestamp: "2024-02-15 14:32:45",
    action: "Key Rotation",
    resource: "API Gateway Key (AES-256)",
    user: "admin@example.com",
    ipAddress: "192.168.1.100",
    status: "success",
    details: "Scheduled key rotation completed successfully",
    hash: "0x8f2e5b7a1c3d9e0f4a6b8c2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f",
  },
  {
    id: "log-2",
    timestamp: "2024-02-15 13:15:22",
    action: "Login Attempt",
    resource: "Admin Portal",
    user: "analyst@example.com",
    ipAddress: "192.168.1.105",
    status: "failure",
    details: "Failed login attempt: Invalid 2FA code",
    hash: "0x7a1c3d9e0f4a6b8c2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b",
  },
  {
    id: "log-3",
    timestamp: "2024-02-15 12:05:17",
    action: "Key Access",
    resource: "Database Encryption Key (Kyber-1024)",
    user: "system@example.com",
    ipAddress: "192.168.1.50",
    status: "success",
    details: "Automated system accessed key for database backup",
    hash: "0x3d9e0f4a6b8c2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b7a1c",
  },
  {
    id: "log-4",
    timestamp: "2024-02-15 10:45:33",
    action: "Permission Change",
    resource: "User Authentication Key (RSA-4096)",
    user: "admin@example.com",
    ipAddress: "192.168.1.100",
    status: "success",
    details: "Added Security Analyst role to access permissions",
    hash: "0x0f4a6b8c2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b7a1c3d9e",
  },
  {
    id: "log-5",
    timestamp: "2024-02-15 09:22:18",
    action: "Key Creation",
    resource: "New Quantum-Resistant Key (Dilithium-5)",
    user: "admin@example.com",
    ipAddress: "192.168.1.100",
    status: "success",
    details: "Created new post-quantum signing key for document verification",
    hash: "0x6b8c2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b7a1c3d9e0f4a",
  },
  {
    id: "log-6",
    timestamp: "2024-02-14 16:55:42",
    action: "System Alert",
    resource: "Security Monitoring",
    user: "system@example.com",
    ipAddress: "192.168.1.50",
    status: "warning",
    details: "Unusual access pattern detected: Multiple key access requests",
    hash: "0x2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b7a1c3d9e0f4a6b8c",
  },
  {
    id: "log-7",
    timestamp: "2024-02-14 14:12:09",
    action: "Login Success",
    resource: "Admin Portal",
    user: "auditor@example.com",
    ipAddress: "192.168.1.110",
    status: "success",
    details: "Successful login with MFA",
    hash: "0x9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b7a1c3d9e0f4a6b8c2d7e",
  },
  {
    id: "log-8",
    timestamp: "2024-02-14 11:30:55",
    action: "Configuration Change",
    resource: "Key Rotation Policy",
    user: "admin@example.com",
    ipAddress: "192.168.1.100",
    status: "success",
    details: "Updated rotation schedule from 90 days to 60 days",
    hash: "0x3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b7a1c3d9e0f4a6b8c2d7e9f1a",
  },
  {
    id: "log-9",
    timestamp: "2024-02-14 09:05:22",
    action: "Key Revocation",
    resource: "Legacy System Auth Key (RSA-2048)",
    user: "admin@example.com",
    ipAddress: "192.168.1.100",
    status: "success",
    details: "Revoked deprecated key as part of system upgrade",
    hash: "0x7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b7a1c3d9e0f4a6b8c2d7e9f1a3b5c",
  },
  {
    id: "log-10",
    timestamp: "2024-02-13 17:42:38",
    action: "Backup Creation",
    resource: "Key Management System",
    user: "system@example.com",
    ipAddress: "192.168.1.50",
    status: "success",
    details: "Automated encrypted backup of key metadata",
    hash: "0x0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b7a1c3d9e0f4a6b8c2d7e9f1a3b5c7d9e",
  },
]

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Blockchain-Based Audit Logs</h1>
        <p className="text-muted-foreground">
          Tamper-proof event logging using Hyperledger Fabric for cryptographic verification
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search logs..."
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
                <Key className="mr-2 h-4 w-4" />
                Key Operations
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                User Actions
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Security Events
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                System Events
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
                <span className="sr-only">Date filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="key">Key Operations</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="system">System Events</SelectItem>
              <SelectItem value="config">Configuration</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="key">Key Events</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
          <TabsTrigger value="user">User Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <div className="flex items-center space-x-1">
                        <span>Timestamp</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={log.resource}>
                        {log.resource}
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.ipAddress}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.status === "success" ? "default" : log.status === "failure" ? "destructive" : "outline"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                Showing <strong>{filteredLogs.length}</strong> of <strong>{auditLogs.length}</strong> logs
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="key" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Operation Events</CardTitle>
              <CardDescription>Audit logs for key creation, rotation, access, and revocation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs
                    .filter(
                      (log) =>
                        log.action.includes("Key") || log.resource.includes("Key") || log.action === "Backup Creation",
                    )
                    .map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.status === "success"
                                ? "default"
                                : log.status === "failure"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Security alerts, warnings, and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs
                    .filter(
                      (log) => log.action.includes("Alert") || log.status === "warning" || log.status === "failure",
                    )
                    .map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.status === "success"
                                ? "default"
                                : log.status === "failure"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="user" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Actions</CardTitle>
              <CardDescription>User login attempts, permission changes, and administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs
                    .filter(
                      (log) =>
                        log.action.includes("Login") || log.action.includes("Permission") || log.user.includes("admin"),
                    )
                    .map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.status === "success"
                                ? "default"
                                : log.status === "failure"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Blockchain Verification</CardTitle>
          <CardDescription>Verify the integrity of audit logs using cryptographic proofs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Selected Log Entry</h3>
                  <p className="text-sm text-muted-foreground">
                    Key Rotation - API Gateway Key (AES-256) - 2024-02-15 14:32:45
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  Block #3,842,651
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-medium">Merkle Proof</h3>
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-xs overflow-auto">
                    <code>
                      {`{
  "root": "0x7a1c3d9e0f4a6b8c2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b",
  "proof": [
    "0x3d9e0f4a6b8c2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b7a1c",
    "0x0f4a6b8c2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b7a1c3d9e",
    "0x6b8c2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f8f2e5b7a1c3d9e0f4a"
  ],
  "leaf": "0x8f2e5b7a1c3d9e0f4a6b8c2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f",
  "index": 0
}`}
                    </code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Log Hash</h3>
                <div className="rounded-md bg-muted p-4">
                  <div className="font-mono text-xs break-all">
                    0x8f2e5b7a1c3d9e0f4a6b8c2d7e9f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f
                  </div>
                </div>

                <h3 className="mb-2 mt-4 text-sm font-medium">Hyperledger Transaction ID</h3>
                <div className="rounded-md bg-muted p-4">
                  <div className="font-mono text-xs break-all">a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6</div>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <div className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Verification Successful</h3>
              </div>
              <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                This log entry has been cryptographically verified and has not been tampered with.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View Raw Log
          </Button>
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            Verify Another Log
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

