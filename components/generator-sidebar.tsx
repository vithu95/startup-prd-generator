"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  Sidebar,
} from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { generatePRD, savePRD } from "@/lib/generate-prd"
import { useAuth } from "@/context/auth-context"
import type { PRDDocument } from "@/lib/supabase"
import { getRandomStartupIdea } from "@/lib/random-ideas"
import { Search, Plus, History, Sparkles, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface GeneratorSidebarProps {
  prds: PRDDocument[]
  selectedPrdId: string | null
  onSelectPrd: (id: string) => void
  onAddPrd: (prd: PRDDocument) => void
}

export function GeneratorSidebar({ prds, selectedPrdId, onSelectPrd, onAddPrd }: GeneratorSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [idea, setIdea] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Filter PRDs based on search query
  const filteredPrds = prds.filter(
    (prd) =>
      prd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prd.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleNewPrd = async () => {
    if (!idea.trim()) {
      toast({
        title: "Please enter your startup idea",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await generatePRD(idea)

      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to sign in to save PRDs",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

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
  }

  return (
    <>
      <SidebarProvider>
        <Sidebar className="border-r" collapsible="offcanvas" side="left">
          <SidebarHeader>
            <div className="p-2">
              <Button onClick={() => setIsDialogOpen(true)} className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                New PRD
              </Button>
            </div>
            <div className="px-2 pb-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search PRDs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                <History className="mr-2 h-4 w-4" />
                Your PRDs
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <SidebarMenu>
                    {filteredPrds.length === 0 ? (
                      <Card className="m-2 p-4 text-center text-sm text-muted-foreground">
                        {searchQuery ? "No PRDs match your search" : "No PRDs yet. Create your first one!"}
                      </Card>
                    ) : (
                      filteredPrds.map((prd) => (
                        <SidebarMenuItem key={prd.id}>
                          <SidebarMenuButton isActive={selectedPrdId === prd.id} onClick={() => onSelectPrd(prd.id!)}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{prd.title}</span>
                              <span className="text-xs text-muted-foreground truncate max-w-full">
                                {prd.created_at && format(new Date(prd.created_at), "MMM d, yyyy")}
                              </span>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    )}
                  </SidebarMenu>
                </ScrollArea>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate a New PRD</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your startup idea..."
                className="h-32"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button variant="outline" onClick={handleFeelingLucky} disabled={loading} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              I'm Feeling Lucky
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleNewPrd} disabled={loading || !idea.trim()}>
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

