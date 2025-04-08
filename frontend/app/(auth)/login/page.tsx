"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, KeyRound, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [step, setStep] = useState<"credentials" | "mfa">("credentials")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("mfa")
  }

  const handleVerifyMFA = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        {step === "credentials" ? (
          <Card className="border-slate-700 bg-slate-900/60 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-10 w-10 text-blue-500" />
              </div>
              <CardTitle className="text-2xl text-center text-white">Rotarix Security</CardTitle>
              <CardDescription className="text-center text-slate-400">
                Enter your credentials to access the security dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      required
                      className="border-slate-700 bg-slate-800 text-slate-200"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-slate-300">
                        Password
                      </Label>
                      <Link href="/forgot-password" className="text-xs text-blue-500 hover:text-blue-400">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        className="border-slate-700 bg-slate-800 text-slate-200 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-slate-400 hover:text-slate-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Continue to Verification
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-sm text-slate-400 text-center mt-2">Protected by Rotarix Advanced Security</div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-slate-700 bg-slate-900/60 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-2">
                <KeyRound className="h-10 w-10 text-blue-500" />
              </div>
              <CardTitle className="text-2xl text-center text-white">Two-Factor Authentication</CardTitle>
              <CardDescription className="text-center text-slate-400">
                Enter the verification code sent to your device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyMFA}>
                <div className="grid gap-6">
                  <Tabs defaultValue="authenticator" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                      <TabsTrigger value="authenticator">Authenticator</TabsTrigger>
                      <TabsTrigger value="sms">SMS</TabsTrigger>
                    </TabsList>
                    <TabsContent value="authenticator" className="mt-4">
                      <div className="flex justify-center space-x-2">
                        {verificationCode.map((digit, index) => (
                          <Input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            className="w-10 h-12 text-center text-lg border-slate-700 bg-slate-800 text-slate-200"
                          />
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="sms" className="mt-4">
                      <div className="flex justify-center space-x-2">
                        {verificationCode.map((digit, index) => (
                          <Input
                            key={index}
                            id={`sms-code-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            className="w-10 h-12 text-center text-lg border-slate-700 bg-slate-800 text-slate-200"
                          />
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Verify & Login
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                variant="link"
                className="text-blue-500 hover:text-blue-400 px-0"
                onClick={() => setStep("credentials")}
              >
                Back to login
              </Button>
              <div className="text-sm text-slate-400 text-center mt-2">Protected by Rotarix Advanced Security</div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

