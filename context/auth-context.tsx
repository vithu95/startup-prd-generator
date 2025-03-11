"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  authLoading: boolean
  signOut: () => Promise<void>
  signInWithGoogle: (redirectUrl?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        // Get the initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        
        setUser(session?.user ?? null)
        setLoading(false)

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.email)
          setUser(session?.user ?? null)
          setLoading(false)
          setAuthLoading(false) // Reset auth loading on state change
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        setUser(null)
        setLoading(false)
        setAuthLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signOut = async () => {
    try {
      setAuthLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const signInWithGoogle = async (redirectUrl?: string) => {
    try {
      setAuthLoading(true)
      // Clear any existing auth errors or state
      localStorage.removeItem('supabase.auth.error')
      
      // Log the redirect URL for debugging
      const finalRedirectUrl = redirectUrl || `${window.location.origin}/generator`
      console.log("Starting Google OAuth with redirect URL:", finalRedirectUrl)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: finalRedirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            // Add specific scopes needed
            scope: "email profile openid",
            response_type: "code",
          },
          skipBrowserRedirect: false, // Ensure browser redirect happens
        },
      })

      if (error) {
        console.error("OAuth error:", error)
        throw error
      }

      if (!data?.url) {
        console.error("No OAuth URL returned")
        throw new Error("Failed to get OAuth URL")
      }

      // Log the OAuth response for debugging
      console.log("OAuth initiated successfully:", {
        provider: data.provider,
        url: data.url.substring(0, 100) + "..." // Log first 100 chars of URL
      })

      // Force the redirect
      window.location.href = data.url

    } catch (error) {
      console.error("Error signing in with Google:", error)
      setAuthLoading(false)
      throw error
    }
  }

  const value = {
    user,
    loading,
    authLoading,
    signOut,
    signInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

