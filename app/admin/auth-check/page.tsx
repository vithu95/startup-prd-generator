"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react"
import { Header } from "@/components/header"

export default function AuthCheckPage() {
  const [checking, setChecking] = useState(true)
  const [googleAuthEnabled, setGoogleAuthEnabled] = useState<boolean | null>(null)
  const { checkGoogleAuthEnabled } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      setChecking(true)
      try {
        const isGoogleEnabled = await checkGoogleAuthEnabled()
        setGoogleAuthEnabled(isGoogleEnabled)
      } catch (error) {
        console.error("Error checking auth status:", error)
        setGoogleAuthEnabled(false)
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [checkGoogleAuthEnabled])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Authentication Configuration Check</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>
                This page checks if your authentication providers are properly configured.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="font-medium">Google OAuth Provider</span>
                  {checking ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : googleAuthEnabled ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                {!checking && !googleAuthEnabled && (
                  <Alert variant="destructive" className="bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Google Authentication Not Configured</AlertTitle>
                    <AlertDescription>
                      Google authentication is not properly configured. This is why you're seeing the 
                      "Unsupported provider: provider is not enabled" error. Please follow these steps:
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Log in to your Supabase dashboard</li>
                        <li>Go to Authentication → Providers</li>
                        <li>Enable the Google provider</li>
                        <li>Add your Google OAuth credentials (Client ID and Client Secret)</li>
                        <li>Make sure the redirect URL is properly configured in Google Cloud Console</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                )}
                
                {!checking && googleAuthEnabled && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-700">Authentication Configured</AlertTitle>
                    <AlertDescription className="text-green-600">
                      Basic authentication is configured correctly. If you're still seeing errors, 
                      please check that you've properly set up the Google OAuth credentials in 
                      both Supabase and Google Cloud Console.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Button onClick={() => window.location.reload()}>
            Refresh Status
          </Button>
        </div>
      </main>
    </div>
  )
} 