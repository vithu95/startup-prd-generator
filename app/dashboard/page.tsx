"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { DashboardContent } from "@/components/dashboard-content"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/generator")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  return <DashboardContent />
}

