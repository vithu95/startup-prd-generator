"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { GeneratorSidebar } from "@/components/generator-sidebar"
import type { PRDDocument } from "@/lib/supabase"

export default function GeneratorContinuePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [prds, setPrds] = useState<PRDDocument[]>([])
  const [selectedPrdId, setSelectedPrdId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/generator")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  const handleAddPrd = (prd: PRDDocument) => {
    setPrds([...prds, prd])
  }

  return (
    <GeneratorSidebar
      prds={prds}
      selectedPrdId={selectedPrdId}
      onSelectPrd={setSelectedPrdId}
      onAddPrd={handleAddPrd}
      onToggleSidebar={() => {}}
    />
  )
} 