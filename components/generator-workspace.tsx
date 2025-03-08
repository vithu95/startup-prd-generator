"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { getPRDById, savePRD } from "@/lib/generate-prd"
import { useAuth } from "@/context/auth-context"
import type { PRDDocument } from "@/lib/supabase"
import { PRDVisualization } from "./prd-visualization"
import { RegenerateSection } from "./regenerate-section"
import { Copy, Loader2, FileJson, FileText } from "lucide-react"

interface GeneratorWorkspaceProps {
  selectedPrdId: string | null
  onUpdatePrd: (prd: PRDDocument) => void
}

export function GeneratorWorkspace({ selectedPrdId, onUpdatePrd }: GeneratorWorkspaceProps) {
  const [prd, setPrd] = useState<PRDDocument | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Fetch the selected PRD when the ID changes
    const fetchPRD = async () => {
      if (selectedPrdId) {
        setLoading(true)
        try {
          const data = await getPRDById(selectedPrdId)
          setPrd(data)
        } catch (error) {
          console.error("Error fetching PRD:", error)
          toast({
            title: "Error",
            description: "Failed to fetch the PRD",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      } else {
        setPrd(null)
      }
    }

    fetchPRD()
  }, [selectedPrdId, toast])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard",
    })
  }

  const downloadMarkdown = () => {
    if (!prd) return

    const blob = new Blob([prd.markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${prd.title.replace(/\s+/g, "-").toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadJson = () => {
    if (!prd) return

    const blob = new Blob([JSON.stringify(prd.json_data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${prd.title.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle section regeneration
  const handleSectionClick = (section: string) => {
    setActiveSection(section)
    setIsRegenerateDialogOpen(true)
  }

  // Update PRD with regenerated section
  const handleSectionUpdate = async (updatedPrd: PRDDocument) => {
    try {
      // Save updated PRD
      const savedPrd = await savePRD(updatedPrd)

      // Update local state
      setPrd(savedPrd)

      // Update parent component
      onUpdatePrd(savedPrd)

      // Close dialog
      setIsRegenerateDialogOpen(false)
      setActiveSection(null)

      toast({
        title: "Section Updated",
        description: "The PRD section has been regenerated successfully",
      })
    } catch (error) {
      console.error("Error updating PRD:", error)
      toast({
        title: "Error",
        description: "Failed to update the PRD section",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!prd) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No PRD Selected</h3>
          <p className="text-gray-500 max-w-md">Select a PRD from the sidebar or create a new one to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b p-4 flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-bold">{prd.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(prd.markdown)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadMarkdown}>
            <FileText className="mr-2 h-4 w-4" />
            Markdown
          </Button>
          <Button variant="outline" size="sm" onClick={downloadJson}>
            <FileJson className="mr-2 h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visual" className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b px-4">
          <TabsList className="my-2">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="visual" className="flex-1 overflow-hidden p-4 relative" forceMount={false}>
          <ScrollArea className="h-full pr-4">
            <PRDVisualization prdData={prd.json_data} onSectionClick={handleSectionClick} isEditable={true} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="markdown" className="flex-1 overflow-hidden p-4" forceMount={false}>
          <Card className="h-full overflow-hidden">
            <ScrollArea className="h-full">
              <pre className="p-4 font-mono text-sm whitespace-pre-wrap">{prd.markdown}</pre>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="json" className="flex-1 overflow-hidden p-4" forceMount={false}>
          <Card className="h-full overflow-hidden">
            <ScrollArea className="h-full">
              <pre className="p-4 font-mono text-sm whitespace-pre-wrap">{JSON.stringify(prd.json_data, null, 2)}</pre>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Section Regeneration Dialog */}
      <RegenerateSection
        isOpen={isRegenerateDialogOpen}
        onClose={() => setIsRegenerateDialogOpen(false)}
        prd={prd}
        section={activeSection}
        onUpdate={handleSectionUpdate}
      />
    </div>
  )
}

