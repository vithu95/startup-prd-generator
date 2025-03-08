"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { GeneratorSidebar } from "@/components/generator-sidebar"
import { GeneratorWorkspace } from "@/components/generator-workspace"
import { useAuth } from "@/context/auth-context"
import { getUserPRDs } from "@/lib/generate-prd"
import type { PRDDocument } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function GeneratorPage() {
  const [prds, setPrds] = useState<PRDDocument[]>([])
  const [selectedPrdId, setSelectedPrdId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Fetch user's PRDs when the component mounts
    const fetchPRDs = async () => {
      if (user) {
        try {
          const data = await getUserPRDs(user.id)
          setPrds(data)

          // If there are PRDs, select the first one by default
          if (data.length > 0) {
            setSelectedPrdId(data[0].id)
          }
        } catch (error) {
          console.error("Error fetching PRDs:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchPRDs()
  }, [user])

  // Function to handle selection of a PRD from the sidebar
  const handleSelectPrd = (id: string) => {
    setSelectedPrdId(id)
  }

  // Function to add a newly generated PRD to the list
  const handleAddPrd = (prd: PRDDocument) => {
    setPrds([prd, ...prds])
    setSelectedPrdId(prd.id)
  }

  // Function to update a PRD in the list
  const handleUpdatePrd = (updatedPrd: PRDDocument) => {
    setPrds(prds.map((prd) => (prd.id === updatedPrd.id ? updatedPrd : prd)))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <GeneratorSidebar
          prds={prds}
          selectedPrdId={selectedPrdId}
          onSelectPrd={handleSelectPrd}
          onAddPrd={handleAddPrd}
        />
        <GeneratorWorkspace selectedPrdId={selectedPrdId} onUpdatePrd={handleUpdatePrd} />
      </div>
    </div>
  )
}

