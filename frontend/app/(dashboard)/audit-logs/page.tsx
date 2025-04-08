"use client"

import { useState, useEffect } from "react"
import {
  ArrowUpDown,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Shield,
  ShieldAlert,
  Upload,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuditLog {
  id: string
  timestamp: string
  event: string
  user: string
  details: string
  status: string
  verification: string
  ipAddress: string
  userAgent: string
  location: string
  keyId?: string
  keyType?: string
  actionType: string
  blockchainTxHash: string
  blockNumber: number
  previousValue?: string
  newValue?: string
  affectedResources: string[]
  riskLevel: 'low' | 'medium' | 'high'
  relatedEvents?: string[]
}

const defaultLogs: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "2024-02-15T10:30:00Z",
    event: "Key Creation",
    user: "admin@example.com",
    details: "Created new AES-256 key for API Gateway",
    status: "success",
    verification: "verified",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0",
    location: "New York, USA",
    keyId: "key-abc-123",
    keyType: "AES-256",
    actionType: "CREATE",
    blockchainTxHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    blockNumber: 12345678,
    affectedResources: ["API Gateway", "Key Vault"],
    riskLevel: "low",
    relatedEvents: ["Key Policy Update", "Access Policy Update"]
  },
  // ... rest of the default logs ...
]

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [showRawLogDialog, setShowRawLogDialog] = useState(false)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [visibleColumns, setVisibleColumns] = useState({
    timestamp: true,
    event: true,
    user: true,
    details: true,
    status: true,
    verification: true,
  })
  const { toast } = useToast()

  // Initialize logsList from localStorage or use default logs
  const [logsList, setLogsList] = useState<AuditLog[]>(() => {
    if (typeof window !== 'undefined') {
      const savedLogs = localStorage.getItem('auditLogs')
      return savedLogs ? JSON.parse(savedLogs) : defaultLogs
    }
    return defaultLogs
  })

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('auditLogs', JSON.stringify(logsList))
  }, [logsList])

  const filteredLogs = logsList.filter((log) => {
    const matchesSearch = 
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDate = selectedDate 
      ? format(new Date(log.timestamp), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      : true
    
    const matchesEvent = selectedEvent === "all" || log.event === selectedEvent

    return matchesSearch && matchesDate && matchesEvent
  })

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (!sortConfig) return 0
    
    const aValue = a[sortConfig.key as keyof AuditLog]
    const bValue = b[sortConfig.key as keyof AuditLog]
    
    if (aValue === undefined || bValue === undefined) return 0
    
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { key, direction: 'asc' }
    })
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "The text has been copied to your clipboard.",
    })
  }

  const handleExport = (format: 'json' | 'csv') => {
    const data = format === 'json' 
      ? JSON.stringify(logsList, null, 2)
      : logsList.map(log => Object.values(log).join(',')).join('\n')
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs.${format}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleVerifyLog = (log: AuditLog) => {
    // In a real app, this would verify the log against the blockchain
    toast({
      title: "Log Verified",
      description: `The log "${log.id}" has been verified against the blockchain.`,
    })
  }

  const LogDetailsDialog = ({ log }: { log: AuditLog }) => {
    return (
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Event Details</span>
              <Badge variant={
                log.riskLevel === "high" ? "destructive" :
                log.riskLevel === "medium" ? "secondary" :
                "default"
              }>
                {log.riskLevel.toUpperCase()} Risk
              </Badge>
            </DialogTitle>
            <DialogDescription>Detailed information about the selected event</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Event ID</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="rounded bg-muted px-2 py-1 text-sm">{log.id}</code>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(log.id)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy event ID</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Timestamp</h3>
                  <p className="mt-1">{format(new Date(log.timestamp), "PPP p")}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Event Type</h3>
                  <p className="mt-1">{log.event}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Action Type</h3>
                  <p className="mt-1">{log.actionType}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">User</h3>
                  <p className="mt-1">{log.user}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">IP Address</h3>
                  <p className="mt-1">{log.ipAddress}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p className="mt-1">{log.location}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">User Agent</h3>
                  <p className="mt-1 text-sm">{log.userAgent}</p>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                    <p className="mt-1">{log.details}</p>
                  </div>

                  {log.keyId && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Key Information</h4>
                      <div className="mt-1 space-y-1">
                        <p>ID: {log.keyId}</p>
                        <p>Type: {log.keyType}</p>
                      </div>
                    </div>
                  )}

                  {(log.previousValue || log.newValue) && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Changes</h4>
                      <div className="mt-1 space-y-1">
                        {log.previousValue && <p>Previous Value: {log.previousValue}</p>}
                        {log.newValue && <p>New Value: {log.newValue}</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Affected Resources</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {log.affectedResources.map((resource, index) => (
                        <Badge key={index} variant="outline">{resource}</Badge>
                      ))}
                    </div>
                  </div>

                  {log.relatedEvents && log.relatedEvents.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Related Events</h4>
                      <div className="mt-1 space-y-1">
                        {log.relatedEvents.map((event, index) => (
                          <p key={index} className="text-sm">{event}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Blockchain Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Blockchain Verification</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="mt-1">
                    <Badge
                      variant={
                        log.verification === "verified"
                          ? "default"
                          : log.verification === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {log.verification}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Transaction Hash</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="rounded bg-muted px-2 py-1 text-sm truncate">
                      {log.blockchainTxHash}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleCopy(log.blockchainTxHash)}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy transaction hash</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Block Number</h4>
                  <p className="mt-1">{log.blockNumber}</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            <Button onClick={() => handleVerifyLog(log)}>
              Verify on Blockchain
            </Button>
            <Button variant="secondary" onClick={() => {
              setSelectedLog(log)
              setShowRawLogDialog(true)
              setShowDetailsDialog(false)
            }}>
              View Raw Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">
          Monitor and verify all cryptographic key operations
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-4 w-4" />
                <span className="sr-only">Select date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date: Date | undefined) => setSelectedDate(date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="Key Creation">Key Creation</SelectItem>
              <SelectItem value="Key Rotation">Key Rotation</SelectItem>
              <SelectItem value="Key Revocation">Key Revocation</SelectItem>
              <SelectItem value="Access Attempt">Access Attempt</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Show Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={visibleColumns.timestamp}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, timestamp: checked }))}
              >
                Timestamp
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.event}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, event: checked }))}
              >
                Event
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.user}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, user: checked }))}
              >
                User
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.details}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, details: checked }))}
              >
                Details
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.status}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, status: checked }))}
              >
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.verification}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, verification: checked }))}
              >
                Verification
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <div className="flex justify-between px-2 py-1.5">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setVisibleColumns({
                    timestamp: true,
                    event: true,
                    user: true,
                    details: true,
                    status: true,
                    verification: true,
                  })}
                >
                  Reset
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    // Apply the changes
                    toast({
                      title: "Columns Updated",
                      description: "The table columns have been updated successfully.",
                    })
                  }}
                >
                  Apply
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Verify Other Log
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verify Log</DialogTitle>
                <DialogDescription>
                  Upload a log file to verify it against the blockchain
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="log-file">Log File</Label>
                  <Input
                    id="log-file"
                    type="file"
                    accept=".json,.csv"
                    onChange={(e) => {
                      // Handle file upload
                      toast({
                        title: "File Selected",
                        description: "The log file has been selected for verification.",
                      })
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Handle verification
                  toast({
                    title: "Log Verified",
                    description: "The log has been verified against the blockchain.",
                  })
                  setShowVerifyDialog(false)
                }}>
                  Verify
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.timestamp && (
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <span>Timestamp</span>
                      <ArrowUpDown className="h-3 w-3 cursor-pointer" onClick={() => handleSort('timestamp')} />
                    </div>
                  </TableHead>
                )}
                {visibleColumns.event && (
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <span>Event</span>
                      <ArrowUpDown className="h-3 w-3 cursor-pointer" onClick={() => handleSort('event')} />
                    </div>
                  </TableHead>
                )}
                {visibleColumns.user && <TableHead>User</TableHead>}
                {visibleColumns.details && <TableHead>Details</TableHead>}
                {visibleColumns.status && <TableHead>Status</TableHead>}
                {visibleColumns.verification && <TableHead>Verification</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLogs.map((log) => (
                <TableRow key={log.id}>
                  {visibleColumns.timestamp && (
                    <TableCell>{format(new Date(log.timestamp), "PPP p")}</TableCell>
                  )}
                  {visibleColumns.event && <TableCell>{log.event}</TableCell>}
                  {visibleColumns.user && <TableCell>{log.user}</TableCell>}
                  {visibleColumns.details && <TableCell>{log.details}</TableCell>}
                  {visibleColumns.status && (
                    <TableCell>
                      <Badge
                        variant={
                          log.status === "success"
                            ? "default"
                            : log.status === "warning"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.verification && (
                    <TableCell>
                      <Badge
                        variant={
                          log.verification === "verified"
                            ? "default"
                            : log.verification === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {log.verification}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedLog(log)
                          setShowDetailsDialog(true)
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedLog(log)
                          setShowRawLogDialog(true)
                        }}>
                          <Copy className="mr-2 h-4 w-4" />
                          View Raw Log
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleVerifyLog(log)}>
                          <Shield className="mr-2 h-4 w-4" />
                          Verify on Blockchain
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      {selectedLog && <LogDetailsDialog log={selectedLog} />}

      {/* Raw Log Dialog */}
      <Dialog open={showRawLogDialog} onOpenChange={setShowRawLogDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Raw Log Data</DialogTitle>
            <DialogDescription>View the raw blockchain-verified log data</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <pre className="rounded-lg bg-muted p-4 overflow-auto max-h-[60vh]">
              <code>{JSON.stringify(selectedLog, null, 2)}</code>
            </pre>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => handleCopy(JSON.stringify(selectedLog, null, 2))}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy raw log</span>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRawLogDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 