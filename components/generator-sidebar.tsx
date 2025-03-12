"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { generatePRD, savePRD } from "@/lib/generate-prd"
import { useAuth } from "@/context/auth-context"
import type { PRDDocument } from "@/lib/supabase"
import { getRandomStartupIdea } from "@/lib/random-ideas"
import { Search, Plus, History, Sparkles, Loader2, ChevronLeft } from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Label } from "@/components/ui/label"

interface GeneratorSidebarProps {
  prds: PRDDocument[]
  selectedPrdId: string | null
  onSelectPrd: (id: string) => void
  onAddPrd: (prd: PRDDocument) => void
  onToggleSidebar: () => void
}

export function GeneratorSidebar({ 
  prds, 
  selectedPrdId, 
  onSelectPrd, 
  onAddPrd,
  onToggleSidebar
}: GeneratorSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [idea, setIdea] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { user, signInWithGoogle, authLoading } = useAuth()

  // Handle pending PRD after login
  useEffect(() => {
    const handlePendingPrd = async () => {
      if (user && !authLoading) {
        const pendingIdea = localStorage.getItem('pendingPrdIdea');
        const isFeelingLucky = localStorage.getItem('pendingPrdFeelingLucky');
        
        if (pendingIdea) {
          setIsDialogOpen(true);
          setIdea(pendingIdea);
          
          // If it was a "feeling lucky" request, automatically generate
          if (isFeelingLucky) {
            setLoading(true);
            try {
              const result = await generatePRD(pendingIdea);
              const savedPrd = await savePRD({
                user_id: user.id,
                title: result.json.startup_name || "Untitled PRD",
                description: result.json.overview.idea_summary || pendingIdea,
                markdown: result.markdown,
                json_data: result.json,
              });

              onAddPrd(savedPrd);
              setIsDialogOpen(false);
              setIdea("");
              
              toast({
                title: "Random PRD Generated Successfully",
                description: "Your random PRD has been created",
              });
            } catch (error) {
              toast({
                title: "Error generating PRD",
                description: "Please try again",
                variant: "destructive",
              });
            } finally {
              setLoading(false);
            }
          }
          
          // Clear the pending data
          localStorage.removeItem('pendingPrdIdea');
          localStorage.removeItem('pendingPrdFeelingLucky');
        }
      }
    };

    handlePendingPrd();
  }, [user, authLoading, toast, onAddPrd]);

  // Filter PRDs based on search query
  const filteredPrds = prds.filter(
    (prd) =>
      prd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prd.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    // Add keyboard shortcut for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    
    // Add event listener for opening generator dialog
    const handleOpenDialog = (e: CustomEvent) => {
      setIsDialogOpen(true);
      setIdea(e.detail.idea);
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('openGeneratorDialog', handleOpenDialog as EventListener)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('openGeneratorDialog', handleOpenDialog as EventListener)
    }
  }, [])

  const handleNewPrd = async () => {
    if (!idea.trim()) {
      toast({
        title: "Please enter your startup idea",
        variant: "destructive",
      })
      return
    }

    // If user is not logged in, redirect to Google sign-in
    if (!user) {
      setIsDialogOpen(false);
      
      // Save the idea in localStorage so we can retrieve it after login
      localStorage.setItem('pendingPrdIdea', idea);
      // Create a redirect URL to return to the PRD generation
      const redirectUrl = `${window.location.origin}/generator`;
      
      try {
        await signInWithGoogle(redirectUrl);
        // The redirect will happen automatically via the signInWithGoogle method
        return; // Add early return to prevent further execution
      } catch (error) {
        console.error("Google sign-in error:", error);
        toast({
          title: "Error",
          description: "Failed to sign in with Google. Please try again.",
          variant: "destructive",
        });
        return; // Add early return on error
      }
    }

    setLoading(true)
    try {
      const result = await generatePRD(idea)

      // Save the PRD
      const savedPrd = await savePRD({
        user_id: user.id,
        title: result.json.startup_name || "Untitled PRD",
        description: result.json.overview.idea_summary || idea,
        markdown: result.markdown,
        json_data: result.json,
      })

      toast({
        title: "PRD Generated Successfully",
        description: "Your new PRD has been created",
      })

      // Add the new PRD to the list
      onAddPrd(savedPrd)

      // Close the dialog and reset the idea
      setIsDialogOpen(false)
      setIdea("")
      
      // Close the sidebar
      onToggleSidebar()
    } catch (error) {
      toast({
        title: "Error generating PRD",
        description: "Please try again with a different idea",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFeelingLucky = async () => {
    const randomIdea = getRandomStartupIdea()
    setIdea(randomIdea)

    // If user is not logged in, redirect to Google sign-in
    if (!user) {
      setIsDialogOpen(false);
      
      // Save the random idea in localStorage so we can retrieve it after login
      localStorage.setItem('pendingPrdIdea', randomIdea);
      localStorage.setItem('pendingPrdFeelingLucky', 'true');
      // Create a redirect URL to return to the PRD generation
      const redirectUrl = `${window.location.origin}/generator`;
      
      try {
        await signInWithGoogle(redirectUrl);
        // The redirect will happen automatically via the signInWithGoogle method
      } catch (error) {
        console.error("Google sign-in error:", error);
        toast({
          title: "Error",
          description: "Failed to sign in with Google. Please try again.",
          variant: "destructive",
        });
      }
    }

    // Continue with PRD generation if user is logged in
    setLoading(true)
    try {
      const result = await generatePRD(randomIdea)
      
      // Save the PRD
      const savedPrd = await savePRD({
        user_id: user.id,
        title: result.json.startup_name || "Untitled PRD",
        description: result.json.overview.idea_summary || randomIdea,
        markdown: result.markdown,
        json_data: result.json,
      })

      toast({
        title: "Random PRD Generated Successfully",
        description: "Your random PRD has been created",
      })

      // Add the new PRD to the list
      onAddPrd(savedPrd)

      // Close the dialog and reset the idea
      setIsDialogOpen(false)
      setIdea("")
      
      // Close the sidebar
      onToggleSidebar()
    } catch (error) {
      toast({
        title: "Error generating PRD",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold flex items-center text-gray-900 dark:text-white">
            <History className="mr-2 h-5 w-5 text-primary" />
            Your PRDs
          </h2>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebar}
              className="md:hidden text-gray-500 dark:text-gray-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-3"
            >
              <Plus className="h-4 w-4 mr-1" /> New
            </Button>
          </div>
        </div>
        
        {/* Search box with dark mode */}
        <div className={`p-4 border-b border-gray-100 dark:border-gray-800 ${searchFocused ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={searchRef}
              placeholder="Search PRDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredPrds.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No PRDs found</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(true)}
                  className="border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first PRD
                </Button>
              </div>
            ) : (
              filteredPrds.map((prd) => (
                <button
                  key={prd.id}
                  onClick={() => onSelectPrd(prd.id)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    selectedPrdId === prd.id 
                      ? 'bg-primary/10 dark:bg-primary/20 border-l-2 border-primary' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white truncate">{prd.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {format(new Date(prd.created_at), 'MMM d, yyyy')}
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Create New PRD</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="idea" className="text-gray-700 dark:text-gray-300">
                Describe your startup idea or product
              </Label>
              <Textarea
                id="idea"
                placeholder="e.g., A mobile app that helps pet owners find pet sitters in their neighborhood"
                className="min-h-32 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Button 
                variant="outline" 
                onClick={handleFeelingLucky} 
                disabled={loading} 
                className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                I'm Feeling Lucky
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              disabled={loading}
              className="rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleNewPrd} 
              disabled={loading || !idea.trim()}
              className="rounded-full bg-primary text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate PRD"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

