"use client"

import { useState } from "react"
import { Bell, Cloud, Database, Key, Lock, Mail, Save, Slack, Webhook } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [slackEnabled, setSlackEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure system settings, integrations, and notification preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input id="system-name" defaultValue="Rotarix Security Dashboard" />
                <p className="text-xs text-muted-foreground">
                  This name will appear in the browser title and notifications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                    <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">All dates and times will be displayed in this timezone</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="iso">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iso">ISO 8601 (YYYY-MM-DD)</SelectItem>
                    <SelectItem value="us">US Format (MM/DD/YYYY)</SelectItem>
                    <SelectItem value="eu">EU Format (DD/MM/YYYY)</SelectItem>
                    <SelectItem value="custom">Custom Format</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">This format will be used throughout the dashboard</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <Switch id="dark-mode" defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground">Enable dark mode for the dashboard interface</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" className="w-20" />
                </div>
                <p className="text-xs text-muted-foreground">Automatically log out after this period of inactivity</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security policies and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Authentication</h3>
                <Separator />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mfa-required">Require Multi-Factor Authentication</Label>
                  <Switch id="mfa-required" defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground">All users must set up MFA to access the system</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mfa-type">MFA Method</Label>
                <Select defaultValue="totp">
                  <SelectTrigger id="mfa-type">
                    <SelectValue placeholder="Select MFA method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="totp">Time-based One-Time Password (TOTP)</SelectItem>
                    <SelectItem value="sms">SMS Verification</SelectItem>
                    <SelectItem value="email">Email Verification</SelectItem>
                    <SelectItem value="hardware">Hardware Security Key</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Primary method for multi-factor authentication</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                  <Input id="password-expiry" type="number" defaultValue="90" className="w-20" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Users will be required to change passwords after this period
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Key Management</h3>
                <Separator />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-rotation">Default Key Rotation Period (days)</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="default-rotation">
                    <SelectValue placeholder="Select rotation period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="180">180 Days</SelectItem>
                    <SelectItem value="365">365 Days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Default rotation period for newly created keys</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-rotation">Enable Automatic Key Rotation</Label>
                  <Switch id="auto-rotation" defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground">Automatically rotate keys according to their schedule</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quantum-resistant">Prefer Quantum-Resistant Algorithms</Label>
                  <Switch id="quantum-resistant" defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground">Use post-quantum cryptography when available</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive security alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <Separator />
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">Email Notifications</h4>
                        <p className="text-xs text-muted-foreground">Receive security alerts via email</p>
                      </div>
                      <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                    </div>
                    {emailEnabled && (
                      <div className="mt-3 space-y-2">
                        <Label htmlFor="email-recipients">Email Recipients</Label>
                        <Input id="email-recipients" defaultValue="admin@example.com, security@example.com" />
                        <p className="text-xs text-muted-foreground">Comma-separated list of email addresses</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                    <Slack className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">Slack Notifications</h4>
                        <p className="text-xs text-muted-foreground">Receive security alerts in Slack</p>
                      </div>
                      <Switch checked={slackEnabled} onCheckedChange={setSlackEnabled} />
                    </div>
                    {slackEnabled && (
                      <div className="mt-3 space-y-2">
                        <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                        <Input
                          id="slack-webhook"
                          defaultValue="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
                        />
                        <div className="flex items-center justify-between">
                          <Label htmlFor="slack-channel">Channel</Label>
                          <Input id="slack-channel" defaultValue="#security-alerts" className="w-40" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">In-Dashboard Notifications</h4>
                        <p className="text-xs text-muted-foreground">Show alerts within the dashboard interface</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <Separator />
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Alert Severity Thresholds</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-severity" className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        High Severity
                      </Label>
                      <Switch id="high-severity" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="medium-severity" className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        Medium Severity
                      </Label>
                      <Switch id="medium-severity" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="low-severity" className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        Low Severity
                      </Label>
                      <Switch id="low-severity" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiet-hours">Quiet Hours</Label>
                  <div className="flex items-center gap-2">
                    <Input id="quiet-hours-start" type="time" defaultValue="22:00" className="w-24" />
                    <span>to</span>
                    <Input id="quiet-hours-end" type="time" defaultValue="07:00" className="w-24" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Only high severity alerts will be sent during quiet hours
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect with external systems and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Cloud Providers</h3>
                <Separator />
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                    <Cloud className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">AWS Integration</h4>
                        <p className="text-xs text-muted-foreground">Connect to AWS services and monitor security</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="aws-access-key">Access Key ID</Label>
                          <Input id="aws-access-key" defaultValue="AKIAIOSFODNN7EXAMPLE" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aws-secret-key">Secret Access Key</Label>
                          <Input
                            id="aws-secret-key"
                            defaultValue="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                            type="password"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aws-region">Region</Label>
                        <Select defaultValue="us-east-1">
                          <SelectTrigger id="aws-region">
                            <SelectValue placeholder="Select AWS region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                            <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                            <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                            <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                    <Cloud className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">Azure Integration</h4>
                        <p className="text-xs text-muted-foreground">Connect to Azure services and monitor security</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Security Tools</h3>
                <Separator />
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">Splunk Integration</h4>
                        <p className="text-xs text-muted-foreground">Connect to Splunk for advanced log analysis</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="splunk-url">Splunk URL</Label>
                          <Input id="splunk-url" defaultValue="https://splunk.example.com:8089" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="splunk-token">API Token</Label>
                          <Input
                            id="splunk-token"
                            defaultValue="eyJrIjoiT0tTcG1pUlY2RnVKZTFVaDFsNFZXdE9ZWmNrMkZYbk"
                            type="password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">HashiCorp Vault Integration</h4>
                        <p className="text-xs text-muted-foreground">Connect to Vault for secure secret management</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vault-url">Vault URL</Label>
                          <Input id="vault-url" defaultValue="https://vault.example.com:8200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vault-token">Token</Label>
                          <Input
                            id="vault-token"
                            defaultValue="hvs.CAESIJVXMKSCTySIKUNLpUdOFd7w1BbB6Od0YT"
                            type="password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage API keys and webhooks for external system integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">API Keys</h3>
                <Separator />
              </div>

              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold">Production API Key</h4>
                      <p className="text-xs text-muted-foreground">Created on 2023-12-15 • Last used 2 hours ago</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-600">
                        Revoke
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        id="api-key"
                        value="rtx_prod_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold">Development API Key</h4>
                      <p className="text-xs text-muted-foreground">Created on 2024-01-10 • Last used 1 day ago</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-600">
                        Revoke
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="dev-api-key">API Key</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        id="dev-api-key"
                        value="rtx_dev_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4"
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>

                <Button>
                  <Key className="mr-2 h-4 w-4" />
                  Create New API Key
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Webhooks</h3>
                <Separator />
              </div>

              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold">Security Alert Webhook</h4>
                      <p className="text-xs text-muted-foreground">Sends security alerts to external systems</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" defaultValue="https://api.example.com/webhooks/security-alerts" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="webhook-secret">Webhook Secret</Label>
                        <Input
                          id="webhook-secret"
                          defaultValue="whsec_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
                          type="password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="webhook-events">Events</Label>
                        <Select defaultValue="all">
                          <SelectTrigger id="webhook-events">
                            <SelectValue placeholder="Select events" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Events</SelectItem>
                            <SelectItem value="high">High Severity Only</SelectItem>
                            <SelectItem value="key">Key Operations Only</SelectItem>
                            <SelectItem value="auth">Authentication Events Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Button>
                  <Webhook className="mr-2 h-4 w-4" />
                  Add Webhook
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">API Documentation</h3>
                <Separator />
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  Access the API documentation to learn how to integrate with the Rotarix security platform.
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline">View API Documentation</Button>
                  <Button variant="outline">Download OpenAPI Spec</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

