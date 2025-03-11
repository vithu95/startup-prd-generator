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
      <div className="flex flex-col h-full">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">Your PRDs</h2>
            <Button 
              onClick={onToggleSidebar} 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <motion.div
            className="relative"
            animate={{ 
              scale: searchFocused ? 1.02 : 1,
              boxShadow: searchFocused ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            transition={{ duration: 0.2 }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              ref={searchRef}
              placeholder="Search PRDs..."
              className="pl-9 border border-gray-200 rounded-full py-2 bg-gray-50 hover:bg-white focus:bg-white transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchFocused && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                ⌘ K
              </div>
            )}
          </motion.div>
          
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="mt-4 w-full bg-primary hover:bg-primary/90 text-white rounded-full py-2"
            disabled={authLoading}
          >
            {authLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {authLoading ? "Authenticating..." : "Create New PRD"}
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-1">
            <AnimatePresence>
              {filteredPrds.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="m-4 p-6 text-center rounded-lg bg-gray-50 border border-gray-100"
                >
                  <p className="text-gray-500 text-sm">
                    {searchQuery ? "No PRDs match your search" : "No PRDs yet. Create your first one!"}
                  </p>
                </motion.div>
              ) : (
                filteredPrds.map((prd, index) => (
                  <motion.div
                    key={prd.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => onSelectPrd(prd.id!)}
                      className={`w-full p-4 mb-2 text-left transition-all rounded-xl hover:bg-gray-50 ${
                        selectedPrdId === prd.id
                          ? "bg-gray-50 border-l-4 border-primary"
                          : "border-l-4 border-transparent"
                      }`}
                    >
                      <h3 className="font-medium text-gray-800 truncate">{prd.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {prd.created_at && format(new Date(prd.created_at), "MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {prd.description.substring(0, 60)}{prd.description.length > 60 ? '...' : ''}
                      </p>
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Create a New PRD</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your startup idea..."
                className="h-32 resize-none focus:ring-primary transition-shadow rounded-lg"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={handleFeelingLucky} 
              disabled={loading} 
              className="w-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
              I'm Feeling Lucky
            </Button>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              disabled={loading}
              className="rounded-full border border-gray-200"
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

