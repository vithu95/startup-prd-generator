"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { getUserPRDs, deletePRD } from "@/lib/generate-prd"
import type { PRDDocument } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Loader2, Plus, Trash2, Eye } from "lucide-react"

export default function Dashboard() {
  const [prds, setPrds] = useState<PRDDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/sign-in")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchPRDs = async () => {
      if (user) {
        try {
          const data = await getUserPRDs(user.id)
          setPrds(data)
        } catch (error) {
          console.error("Error fetching PRDs:", error)
          toast({
            title: "Error",
            description: "Failed to fetch your PRDs. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      fetchPRDs()
    }
  }, [user, toast])

  const handleDelete = async (id: string) => {
    try {
      await deletePRD(id)
      setPrds(prds.filter((prd) => prd.id !== id))
      toast({
        title: "Success",
        description: "PRD deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting PRD:", error)
      toast({
        title: "Error",
        description: "Failed to delete PRD. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleView = (id: string) => {
    router.push(`/prd/${id}`)
  }

  if (authLoading || (isLoading && user)) {
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
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your PRDs</h1>
          <Button onClick={() => router.push("/")} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create New PRD
          </Button>
        </div>

        {prds.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">You haven&apos;t created any PRDs yet.</p>
              <Button onClick={() => router.push("/")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First PRD
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prds.map((prd) => (
              <Card key={prd.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="truncate">{prd.title}</CardTitle>
                  <CardDescription className="truncate">{prd.description}</CardDescription>
                </CardHeader>
                <CardContent className="h-24 overflow-hidden text-sm text-gray-600">{prd.description}</CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleView(prd.id!)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(prd.id!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

