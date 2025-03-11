"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signInWithGoogle: (redirectUrl?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const signInWithGoogle = async (redirectUrl?: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl
            ? `${window.location.origin}/generator`
            : `${window.location.origin}/generator`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })
      if (error) throw error
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
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

