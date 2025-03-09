"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { generatePRD, savePRD } from "@/lib/generate-prd"

export default function ContinueGenerationPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [processingIdea, setProcessingIdea] = useState(false)

  useEffect(() => {
    const continueGeneration = async () => {
      // Wait for auth to be ready
      if (isLoading) return
      
      // If user is not logged in, redirect to login
      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to continue.",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }
      
      // Check if we have a pending PRD idea
      const pendingIdea = localStorage.getItem('pendingPrdIdea')
      const isFeelingLucky = localStorage.getItem('pendingPrdFeelingLucky') === 'true'
      
      if (!pendingIdea) {
        // No pending idea, redirect to generator page
        router.push("/generator")
        return
      }
      
      try {
        setProcessingIdea(true)
        toast({
          title: "Continuing PRD Generation",
          description: "Generating your PRD now that you're logged in...",
        })
        
        // Generate the PRD with the saved idea
        const result = await generatePRD(pendingIdea)
        
        // Save the PRD
        const savedPrd = await savePRD({
          user_id: user.id,
          title: result.json.startup_name || "Untitled PRD",
          description: result.json.overview.idea_summary || pendingIdea,
          markdown: result.markdown,
          json_data: result.json,
        })
        
        // Clear the pending idea from localStorage
        localStorage.removeItem('pendingPrdIdea')
        localStorage.removeItem('pendingPrdFeelingLucky')
        
        toast({
          title: "PRD Generated Successfully",
          description: isFeelingLucky 
            ? "Your random PRD has been created!"
            : "Your PRD has been created!",
        })
        
        // Redirect to the PRD
        router.push(`/prd/${savedPrd.id}`)
      } catch (error) {
        console.error("Error generating PRD:", error)
        toast({
          title: "Error generating PRD",
          description: "There was an error generating your PRD. Please try again.",
          variant: "destructive",
        })
        router.push("/generator")
      } finally {
        setProcessingIdea(false)
      }
    }
    
    continueGeneration()
  }, [user, isLoading, router, toast])
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Continuing Your PRD Generation</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            We're resuming your PRD generation now that you're logged in.
            Please wait a moment while we process your idea...
          </p>
        </div>
      </main>
    </div>
  )
} 