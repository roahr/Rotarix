"use client"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  ArrowUpDown,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Eye,
  EyeOff,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Key {
  id: string
  name: string
  type: string
  algorithm: string
  created: string
  lastRotated: string
  nextRotation: string
  status: string
  rotationStatus: string
}

const defaultKeys: Key[] = [
  {
    id: "key-1",
    name: "API Gateway Key",
    type: "AES-256",
    algorithm: "Symmetric",
    created: "2023-09-15",
    lastRotated: "2023-12-15",
    nextRotation: "2024-03-15",
    status: "active",
    rotationStatus: "upcoming",
  },
  {
    id: "key-2",
    name: "User Authentication",
    type: "RSA-4096",
    algorithm: "Asymmetric",
    created: "2023-08-20",
    lastRotated: "2023-11-20",
    nextRotation: "2024-02-20",
    status: "active",
    rotationStatus: "urgent",
  },
  {
    id: "key-3",
    name: "Database Encryption",
    type: "Kyber-1024",
    algorithm: "Post-Quantum",
    created: "2023-10-05",
    lastRotated: "2024-01-05",
    nextRotation: "2024-04-05",
    status: "active",
    rotationStatus: "healthy",
  },
  {
    id: "key-4",
    name: "Payment Processing",
    type: "AES-256",
    algorithm: "Symmetric",
    created: "2023-11-12",
    lastRotated: "2024-02-12",
    nextRotation: "2024-05-12",
    status: "active",
    rotationStatus: "healthy",
  },
  {
    id: "key-5",
    name: "Backup Encryption",
    type: "Dilithium-5",
    algorithm: "Post-Quantum",
    created: "2023-12-01",
    lastRotated: "2024-01-01",
    nextRotation: "2024-04-01",
    status: "active",
    rotationStatus: "upcoming",
  },
  {
    id: "key-6",
    name: "Legacy System Auth",
    type: "RSA-2048",
    algorithm: "Asymmetric",
    created: "2022-05-10",
    lastRotated: "2023-11-10",
    nextRotation: "2024-02-10",
    status: "deprecated",
    rotationStatus: "urgent",
  },
  {
    id: "key-7",
    name: "Session Tokens",
    type: "AES-256",
    algorithm: "Symmetric",
    created: "2023-07-22",
    lastRotated: "2023-10-22",
    nextRotation: "2024-01-22",
    status: "active",
    rotationStatus: "overdue",
  },
]

export default function KeysPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showKeyValue, setShowKeyValue] = useState(false)
  const [selectedKey, setSelectedKey] = useState<Key | null>(null)
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)
  const [showViewDetailsDialog, setShowViewDetailsDialog] = useState(false)
  const [keyToRevoke, setKeyToRevoke] = useState<Key | null>(null)
  
  // Initialize keysList from localStorage or use default keys
  const [keysList, setKeysList] = useState<Key[]>(() => {
    if (typeof window !== 'undefined') {
      const savedKeys = localStorage.getItem('cryptoKeys')
      return savedKeys ? JSON.parse(savedKeys) : defaultKeys
    }
    return defaultKeys
  })

  // Save keys to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cryptoKeys', JSON.stringify(keysList))
  }, [keysList])

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    type: true,
    algorithm: true,
    created: true,
    lastRotated: true,
    nextRotation: true,
    status: true,
  })
  const { toast } = useToast()
  const [newKey, setNewKey] = useState({
    name: "",
    type: "",
    usage: "",
    rotationSchedule: "90-days",
    autoRotation: true,
    customStartDate: null as Date | null,
    customEndDate: null as Date | null,
  })

  const filteredKeys = keysList.filter(
    (key) =>
      key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.algorithm.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedKeys = [...filteredKeys].sort((a, b) => {
    if (!sortConfig) return 0
    const aValue = a[sortConfig.key as keyof typeof a]
    const bValue = b[sortConfig.key as keyof typeof b]
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
      ? JSON.stringify(keysList, null, 2)
      : keysList.map(key => Object.values(key).join(',')).join('\n')
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `keys.${format}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleRevoke = (key: Key) => {
    if (key.status === "deprecated") {
      toast({
        title: "Key Already Revoked",
        description: `The key "${key.name}" has already been revoked.`,
        variant: "destructive",
      })
      return
    }
    setKeyToRevoke(key)
    setShowRevokeDialog(true)
  }

  const confirmRevoke = () => {
    if (keyToRevoke) {
      // Update the key status in the list
      setKeysList((prevKeys: Key[]) => 
        prevKeys.map((key: Key) => 
          key.id === keyToRevoke.id 
            ? { ...key, status: "deprecated" }
            : key
        )
      )
      
      // Update selected key if it's the one being revoked
      if (selectedKey?.id === keyToRevoke.id) {
        setSelectedKey(prev => prev ? { ...prev, status: "deprecated" } : null)
      }

      toast({
        title: "Key Revoked",
        description: `The key "${keyToRevoke.name}" has been revoked successfully.`,
      })
      setShowRevokeDialog(false)
      setKeyToRevoke(null)
    }
  }

  const canRotateKey = (key: Key) => {
    // Keys can't be rotated if they're deprecated or if they were rotated less than 24 hours ago
    const lastRotation = new Date(key.lastRotated)
    const now = new Date()
    const hoursSinceRotation = (now.getTime() - lastRotation.getTime()) / (1000 * 60 * 60)
    return key.status !== "deprecated" && hoursSinceRotation >= 24
  }

  const handleRotate = (key: Key) => {
    if (canRotateKey(key)) {
      // In a real app, this would make an API call
      toast({
        title: "Key Rotated",
        description: `The key "${key.name}" has been rotated successfully.`,
      })
    } else if (key.status === "deprecated") {
      toast({
        title: "Cannot Rotate Key",
        description: "This key has been revoked and cannot be rotated.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Cannot Rotate Key",
        description: "This key cannot be rotated at this time. Please wait 24 hours after the last rotation.",
        variant: "destructive",
      })
    }
  }

  const handleCreateKey = () => {
    // Generate a new key ID
    const newKeyId = `key-${keysList.length + 1}`
    
    // Get the current date
    const now = new Date()
    const created = format(now, "yyyy-MM-dd")
    
    // Calculate rotation dates based on schedule
    let lastRotated = created
    let nextRotation = ""
    
    if (newKey.rotationSchedule === "custom" && newKey.customStartDate && newKey.customEndDate) {
      lastRotated = format(newKey.customStartDate, "yyyy-MM-dd")
      nextRotation = format(newKey.customEndDate, "yyyy-MM-dd")
    } else {
      const days = parseInt(newKey.rotationSchedule.split("-")[0])
      const nextDate = new Date(now)
      nextDate.setDate(nextDate.getDate() + days)
      nextRotation = format(nextDate, "yyyy-MM-dd")
    }

    // Create the new key object
    const keyToAdd = {
      id: newKeyId,
      name: newKey.name,
      type: newKey.type,
      algorithm: newKey.type.includes("AES") ? "Symmetric" : 
                newKey.type.includes("RSA") ? "Asymmetric" : "Post-Quantum",
      created,
      lastRotated,
      nextRotation,
      status: "active",
      rotationStatus: "healthy",
    }

    // Add the new key to the list
    setKeysList(prevKeys => [...prevKeys, keyToAdd])

    // Reset the form and close the dialog
    setNewKey({
      name: "",
      type: "",
      usage: "",
      rotationSchedule: "90-days",
      autoRotation: true,
      customStartDate: null,
      customEndDate: null,
    })
    setShowCreateDialog(false)

    // Show success message
    toast({
      title: "Key Created",
      description: `The key "${newKey.name}" has been created successfully.`,
    })
  }

  const KeyDetailsDialog = ({ keyData }: { keyData: Key }) => {
    // Get the latest key data from keysList
    const currentKeyData = keysList.find((k: Key) => k.id === keyData.id) || keyData

    return (
      <Dialog open={showViewDetailsDialog} onOpenChange={setShowViewDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Key Details</DialogTitle>
            <DialogDescription>View and manage the selected cryptographic key</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Key ID</h3>
                <div className="flex items-center gap-2 mt-1">
                  <code className="rounded bg-muted px-2 py-1 text-sm">{currentKeyData.id}</code>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(currentKeyData.id)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy key ID</span>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Key Type</h3>
                <p className="mt-1">{currentKeyData.type}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p className="mt-1">{currentKeyData.created}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Rotated</h3>
                <p className="mt-1">{currentKeyData.lastRotated}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Next Scheduled Rotation</h3>
                <p className="mt-1">{currentKeyData.nextRotation}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Key Value</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="relative flex-1">
                    <Input
                      readOnly
                      type={showKeyValue ? "text" : "password"}
                      value={
                        showKeyValue
                          ? "AES256+GCM:ZIgFH8tJzv2L3xBa9YzKqNfD7Uh6RpTm8sVw4XyE="
                          : "••••••••••••••••••••••••••••••••••••••"
                      }
                      className="pr-10 font-mono text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowKeyValue(!showKeyValue)}
                    >
                      {showKeyValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">Toggle key visibility</span>
                    </Button>
                  </div>
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => handleCopy("AES256+GCM:ZIgFH8tJzv2L3xBa9YzKqNfD7Uh6RpTm8sVw4XyE=")}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy key value</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This key is only displayed once for security reasons
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Usage</h3>
                <p className="mt-1">API Gateway Encryption</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Rotation Policy</h3>
                <p className="mt-1">90 days (automatic)</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Access Control</h3>
                <div className="flex gap-2 mt-1">
                  <Badge>Admin</Badge>
                  <Badge variant="outline">Security Analyst</Badge>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => handleRotate(currentKeyData)}
              disabled={!canRotateKey(currentKeyData)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Rotate Now
            </Button>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
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
              <Button 
                variant="destructive"
                onClick={() => handleRevoke(currentKeyData)}
                disabled={currentKeyData.status === "deprecated"}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                {currentKeyData.status === "deprecated" ? "Already Revoked" : "Revoke Key"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Key Management</h1>
        <p className="text-muted-foreground">
          Manage cryptographic keys, schedule rotations, and monitor key lifecycle
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search keys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
          />
          </div>
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
                checked={visibleColumns.name}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, name: checked }))}
              >
                Key Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.type}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, type: checked }))}
              >
                Type
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.algorithm}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, algorithm: checked }))}
              >
                Algorithm
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.created}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, created: checked }))}
              >
                Created
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.lastRotated}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, lastRotated: checked }))}
              >
                Last Rotated
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.nextRotation}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, nextRotation: checked }))}
              >
                Next Rotation
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.status}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, status: checked }))}
              >
                Status
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Cryptographic Key</DialogTitle>
                <DialogDescription>Configure the parameters for your new cryptographic key</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input 
                    id="key-name" 
                    placeholder="e.g., API Authentication Key"
                    value={newKey.name}
                    onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="key-type">Key Type</Label>
                  <Select 
                    value={newKey.type}
                    onValueChange={(value) => setNewKey(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger id="key-type">
                      <SelectValue placeholder="Select key type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AES-256">AES-256 (Symmetric)</SelectItem>
                      <SelectItem value="RSA-4096">RSA-4096 (Asymmetric)</SelectItem>
                      <SelectItem value="Kyber-1024">Kyber-1024 (Post-Quantum)</SelectItem>
                      <SelectItem value="Dilithium-5">Dilithium-5 (Post-Quantum)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="key-usage">Key Usage</Label>
                  <Select 
                    value={newKey.usage}
                    onValueChange={(value) => setNewKey(prev => ({ ...prev, usage: value }))}
                  >
                    <SelectTrigger id="key-usage">
                      <SelectValue placeholder="Select key usage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="encryption">Encryption</SelectItem>
                      <SelectItem value="signing">Digital Signing</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="key-exchange">Key Exchange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rotation-schedule">Rotation Schedule</Label>
                  <Select 
                    value={newKey.rotationSchedule}
                    onValueChange={(value) => setNewKey(prev => ({ ...prev, rotationSchedule: value }))}
                  >
                    <SelectTrigger id="rotation-schedule">
                      <SelectValue placeholder="Select rotation schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30-days">30 Days</SelectItem>
                      <SelectItem value="60-days">60 Days</SelectItem>
                      <SelectItem value="90-days">90 Days</SelectItem>
                      <SelectItem value="180-days">180 Days</SelectItem>
                      <SelectItem value="custom">Custom Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newKey.rotationSchedule === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newKey.customStartDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newKey.customStartDate ? format(newKey.customStartDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newKey.customStartDate || undefined}
                            onSelect={(date) => setNewKey(prev => ({ ...prev, customStartDate: date || null }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newKey.customEndDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newKey.customEndDate ? format(newKey.customEndDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newKey.customEndDate || undefined}
                            onSelect={(date) => setNewKey(prev => ({ ...prev, customEndDate: date || null }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-rotation" 
                    checked={newKey.autoRotation}
                    onCheckedChange={(checked) => setNewKey(prev => ({ ...prev, autoRotation: checked }))}
                  />
                  <Label htmlFor="auto-rotation">Enable automatic rotation</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateKey}
                  disabled={!newKey.name || !newKey.type || !newKey.usage || 
                    (newKey.rotationSchedule === "custom" && (!newKey.customStartDate || !newKey.customEndDate))}
                >
                  Generate Key
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Keys</TabsTrigger>
          <TabsTrigger value="symmetric">Symmetric</TabsTrigger>
          <TabsTrigger value="asymmetric">Asymmetric</TabsTrigger>
          <TabsTrigger value="quantum">Post-Quantum</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.name && (
                    <TableHead className="w-[250px]">
                      <div className="flex items-center space-x-1">
                        <span>Key Name</span>
                          <ArrowUpDown className="h-3 w-3 cursor-pointer" onClick={() => handleSort('name')} />
                      </div>
                    </TableHead>
                    )}
                    {visibleColumns.type && <TableHead>Type</TableHead>}
                    {visibleColumns.algorithm && <TableHead>Algorithm</TableHead>}
                    {visibleColumns.created && (
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Created</span>
                          <ArrowUpDown className="h-3 w-3 cursor-pointer" onClick={() => handleSort('created')} />
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.lastRotated && (
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Last Rotated</span>
                          <ArrowUpDown className="h-3 w-3 cursor-pointer" onClick={() => handleSort('lastRotated')} />
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.nextRotation && (
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Next Rotation</span>
                          <ArrowUpDown className="h-3 w-3 cursor-pointer" onClick={() => handleSort('nextRotation')} />
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.status && <TableHead>Status</TableHead>}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedKeys.map((key) => (
                    <TableRow key={key.id} className={selectedKey?.id === key.id ? "bg-muted" : ""}>
                      {visibleColumns.name && (
                        <TableCell className="font-medium">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto font-medium" 
                            onClick={() => {
                              setSelectedKey(key)
                              setShowViewDetailsDialog(true)
                            }}
                          >
                            {key.name}
                          </Button>
                        </TableCell>
                      )}
                      {visibleColumns.type && <TableCell>{key.type}</TableCell>}
                      {visibleColumns.algorithm && <TableCell>{key.algorithm}</TableCell>}
                      {visibleColumns.created && <TableCell>{key.created}</TableCell>}
                      {visibleColumns.lastRotated && <TableCell>{key.lastRotated}</TableCell>}
                      {visibleColumns.nextRotation && <TableCell>{key.nextRotation}</TableCell>}
                      {visibleColumns.status && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              key.status === "active"
                                ? "default"
                                : key.status === "deprecated"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {key.status}
                          </Badge>
                          <Badge
                            variant={
                              key.rotationStatus === "urgent" || key.rotationStatus === "overdue"
                                ? "destructive"
                                : key.rotationStatus === "upcoming"
                                  ? "outline"
                                  : "default"
                            }
                          >
                            {key.rotationStatus === "urgent" && <Clock className="mr-1 h-3 w-3" />}
                            {key.rotationStatus === "overdue" && <ShieldAlert className="mr-1 h-3 w-3" />}
                            {key.rotationStatus === "upcoming" && <RefreshCw className="mr-1 h-3 w-3" />}
                            {key.rotationStatus === "healthy" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {key.rotationStatus}
                          </Badge>
                        </div>
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              setSelectedKey(key)
                              setShowViewDetailsDialog(true)
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleRotate(key)}
                              disabled={!canRotateKey(key)}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Rotate Key
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopy(key.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Key ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleRevoke(key)}
                              disabled={key.status === "deprecated"}
                            >
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              {key.status === "deprecated" ? "Already Revoked" : "Revoke Key"}
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
        </TabsContent>
        <TabsContent value="symmetric" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Symmetric Keys</h3>
                  <p className="text-sm text-muted-foreground">AES-256 and other symmetric encryption keys</p>
                </div>
                <Badge className="text-sm">{keysList.filter((k) => k.algorithm === "Symmetric").length} Keys</Badge>
              </div>

              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Rotated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keysList
                      .filter((k) => k.algorithm === "Symmetric")
                      .map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.name}</TableCell>
                          <TableCell>{key.type}</TableCell>
                          <TableCell>{key.lastRotated}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  key.status === "active"
                                    ? "default"
                                    : key.status === "deprecated"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {key.status}
                              </Badge>
                            <Badge
                              variant={
                                key.rotationStatus === "urgent" || key.rotationStatus === "overdue"
                                  ? "destructive"
                                  : key.rotationStatus === "upcoming"
                                    ? "outline"
                                    : "default"
                              }
                            >
                                {key.rotationStatus === "urgent" && <Clock className="mr-1 h-3 w-3" />}
                                {key.rotationStatus === "overdue" && <ShieldAlert className="mr-1 h-3 w-3" />}
                                {key.rotationStatus === "upcoming" && <RefreshCw className="mr-1 h-3 w-3" />}
                                {key.rotationStatus === "healthy" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                              {key.rotationStatus}
                            </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedKey(key)
                                setShowViewDetailsDialog(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="asymmetric" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Asymmetric Keys</h3>
                  <p className="text-sm text-muted-foreground">RSA and other public/private key pairs</p>
                </div>
                <Badge className="text-sm">{keysList.filter((k) => k.algorithm === "Asymmetric").length} Keys</Badge>
              </div>

              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Rotated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keysList
                      .filter((k) => k.algorithm === "Asymmetric")
                      .map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.name}</TableCell>
                          <TableCell>{key.type}</TableCell>
                          <TableCell>{key.lastRotated}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  key.status === "active"
                                    ? "default"
                                    : key.status === "deprecated"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {key.status}
                              </Badge>
                            <Badge
                              variant={
                                key.rotationStatus === "urgent" || key.rotationStatus === "overdue"
                                  ? "destructive"
                                  : key.rotationStatus === "upcoming"
                                    ? "outline"
                                    : "default"
                              }
                            >
                                {key.rotationStatus === "urgent" && <Clock className="mr-1 h-3 w-3" />}
                                {key.rotationStatus === "overdue" && <ShieldAlert className="mr-1 h-3 w-3" />}
                                {key.rotationStatus === "upcoming" && <RefreshCw className="mr-1 h-3 w-3" />}
                                {key.rotationStatus === "healthy" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                              {key.rotationStatus}
                            </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedKey(key)
                                setShowViewDetailsDialog(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quantum" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Post-Quantum Keys</h3>
                  <p className="text-sm text-muted-foreground">Quantum-resistant cryptographic keys</p>
                </div>
                <Badge className="text-sm">{keysList.filter((k) => k.algorithm === "Post-Quantum").length} Keys</Badge>
              </div>

              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Rotated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keysList
                      .filter((k) => k.algorithm === "Post-Quantum")
                      .map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.name}</TableCell>
                          <TableCell>{key.type}</TableCell>
                          <TableCell>{key.lastRotated}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  key.status === "active"
                                    ? "default"
                                    : key.status === "deprecated"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {key.status}
                              </Badge>
                            <Badge
                              variant={
                                key.rotationStatus === "urgent" || key.rotationStatus === "overdue"
                                  ? "destructive"
                                  : key.rotationStatus === "upcoming"
                                    ? "outline"
                                    : "default"
                              }
                            >
                                {key.rotationStatus === "urgent" && <Clock className="mr-1 h-3 w-3" />}
                                {key.rotationStatus === "overdue" && <ShieldAlert className="mr-1 h-3 w-3" />}
                                {key.rotationStatus === "upcoming" && <RefreshCw className="mr-1 h-3 w-3" />}
                                {key.rotationStatus === "healthy" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                              {key.rotationStatus}
                            </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedKey(key)
                                setShowViewDetailsDialog(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Details Dialog */}
      {selectedKey && <KeyDetailsDialog keyData={selectedKey} />}

      {/* Revoke Confirmation Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke the key "{keyToRevoke?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevokeDialog(false)}>
              Cancel
                    </Button>
            <Button variant="destructive" onClick={confirmRevoke}>
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

