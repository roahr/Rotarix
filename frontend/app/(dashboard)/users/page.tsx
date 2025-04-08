"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  Check,
  Copy,
  Edit,
  Filter,
  Key,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Trash,
  User,
  UserPlus,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

const users = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    status: "active",
    lastActive: "10 minutes ago",
    mfaEnabled: true,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "user-2",
    name: "Security Analyst",
    email: "analyst@example.com",
    role: "Security Analyst",
    status: "active",
    lastActive: "2 hours ago",
    mfaEnabled: true,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "user-3",
    name: "Auditor User",
    email: "auditor@example.com",
    role: "Auditor",
    status: "active",
    lastActive: "1 day ago",
    mfaEnabled: true,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "user-4",
    name: "System Account",
    email: "system@example.com",
    role: "System",
    status: "active",
    lastActive: "5 minutes ago",
    mfaEnabled: false,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "user-5",
    name: "Developer User",
    email: "developer@example.com",
    role: "Developer",
    status: "inactive",
    lastActive: "30 days ago",
    mfaEnabled: false,
    avatar: "/placeholder-user.jpg",
  },
]

const roles = [
  {
    id: "role-1",
    name: "Admin",
    description: "Full system access and control",
    users: 1,
    permissions: [
      "Manage Users",
      "Manage Keys",
      "View Audit Logs",
      "Configure System",
      "Manage Integrations",
      "Create API Keys",
    ],
  },
  {
    id: "role-2",
    name: "Security Analyst",
    description: "Monitor and respond to security alerts",
    users: 3,
    permissions: ["View Keys", "Rotate Keys", "View Audit Logs", "Manage Alerts", "View Analytics"],
  },
  {
    id: "role-3",
    name: "Auditor",
    description: "View-only access for compliance auditing",
    users: 2,
    permissions: ["View Keys (Metadata Only)", "View Audit Logs", "View Analytics", "Export Reports"],
  },
  {
    id: "role-4",
    name: "Developer",
    description: "Limited access for integration development",
    users: 5,
    permissions: ["View API Documentation", "Use API Keys", "View Limited Logs"],
  },
  {
    id: "role-5",
    name: "System",
    description: "Automated system account",
    users: 1,
    permissions: ["Automated Access", "Scheduled Tasks", "System Integrations"],
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage users, roles, and access control</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Search users..."
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
                    <Check className="mr-2 h-4 w-4" />
                    Active Users
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    Admins Only
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Key className="mr-2 h-4 w-4" />
                    MFA Enabled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account with role-based access</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="security-analyst">Security Analyst</SelectItem>
                          <SelectItem value="auditor">Auditor</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="require-mfa" defaultChecked />
                      <Label htmlFor="require-mfa">Require MFA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="send-invite" defaultChecked />
                      <Label htmlFor="send-invite">Send email invitation</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowAddUserDialog(false)}>Create User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <div className="flex items-center space-x-1">
                        <span>User</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>MFA</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "Admin" ? "default" : user.role === "System" ? "secondary" : "outline"}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "active" ? "outline" : "secondary"}
                          className={user.status === "active" ? "text-green-500" : ""}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        {user.mfaEnabled ? (
                          <Badge variant="outline" className="text-green-500">
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-500">
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
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
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className="mr-2 h-4 w-4" />
                              Reset MFA
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete User
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

          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
              <CardDescription>View and manage user information and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder-user.jpg" alt="Admin User" />
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">Admin User</h3>
                      <p className="text-sm text-muted-foreground">admin@example.com</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>User ID</Label>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1 text-sm">usr_a1b2c3d4e5f6g7h8i9j0</code>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy user ID</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select defaultValue="admin">
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="security-analyst">Security Analyst</SelectItem>
                        <SelectItem value="auditor">Auditor</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select defaultValue="active">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Created</Label>
                    <p className="text-sm">January 15, 2023</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Last Active</Label>
                    <p className="text-sm">10 minutes ago</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Last Password Change</Label>
                    <p className="text-sm">30 days ago</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mfa-status">Multi-Factor Authentication</Label>
                      <Switch id="mfa-status" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">MFA was enabled on January 16, 2023</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Access History</Label>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      View Login History
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline">
                  <Key className="mr-2 h-4 w-4" />
                  Reset Password
                </Button>
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Reset MFA
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete User
                </Button>
                <Button>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Search roles..."
                className="w-full"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={showAddRoleDialog} onOpenChange={setShowAddRoleDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>Define a new role with specific permissions</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="role-name">Role Name</Label>
                      <Input id="role-name" placeholder="e.g., Security Engineer" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role-description">Description</Label>
                      <Input id="role-description" placeholder="Brief description of this role's purpose" />
                    </div>

                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="grid gap-2 pt-2">
                        <h4 className="text-sm font-medium">Key Management</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="view-keys" />
                            <Label htmlFor="view-keys" className="text-sm">
                              View Keys
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="create-keys" />
                            <Label htmlFor="create-keys" className="text-sm">
                              Create Keys
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="rotate-keys" />
                            <Label htmlFor="rotate-keys" className="text-sm">
                              Rotate Keys
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="revoke-keys" />
                            <Label htmlFor="revoke-keys" className="text-sm">
                              Revoke Keys
                            </Label>
                          </div>
                        </div>

                        <h4 className="text-sm font-medium mt-4">User Management</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="view-users" />
                            <Label htmlFor="view-users" className="text-sm">
                              View Users
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="create-users" />
                            <Label htmlFor="create-users" className="text-sm">
                              Create Users
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="edit-users" />
                            <Label htmlFor="edit-users" className="text-sm">
                              Edit Users
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="delete-users" />
                            <Label htmlFor="delete-users" className="text-sm">
                              Delete Users
                            </Label>
                          </div>
                        </div>

                        <h4 className="text-sm font-medium mt-4">System</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="view-logs" />
                            <Label htmlFor="view-logs" className="text-sm">
                              View Audit Logs
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="manage-alerts" />
                            <Label htmlFor="manage-alerts" className="text-sm">
                              Manage Alerts
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="configure-system" />
                            <Label htmlFor="configure-system" className="text-sm">
                              Configure System
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="api-access" />
                            <Label htmlFor="api-access" className="text-sm">
                              API Access
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddRoleDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowAddRoleDialog(false)}>Create Role</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{role.name}</CardTitle>
                    <Badge>
                      {role.users} {role.users === 1 ? "user" : "users"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardDescription>{role.description}</CardDescription>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Permissions</h3>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Users
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash className="mr-2 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

