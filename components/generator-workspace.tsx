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
import { Copy, Loader2, FileJson, FileText, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { JsonViewer } from "@/components/ui/json-viewer"

interface GeneratorWorkspaceProps {
  selectedPrdId: string | null
  onUpdatePrd: (prd: PRDDocument) => void
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export function GeneratorWorkspace({ 
  selectedPrdId, 
  onUpdatePrd,
  onToggleSidebar,
  sidebarOpen
}: GeneratorWorkspaceProps) {
  const [prd, setPrd] = useState<PRDDocument | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("visual")
  const [copyTooltip, setCopyTooltip] = useState("")
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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopyTooltip(`Copied ${type}!`)
    setTimeout(() => setCopyTooltip(""), 2000)
    toast({
      title: `${type} copied to clipboard`,
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
      console.log("Updating PRD with regenerated section:", updatedPrd.id);
      
      // Important safety check - make sure we have the current PRD loaded
      if (!prd) {
        console.error("Cannot update PRD - current PRD is not loaded");
        toast({
          title: "Error",
          description: "Unable to update PRD. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Create a new object with the original description ALWAYS preserved
      const safeUpdatedPrd: PRDDocument = {
        ...updatedPrd,
        description: prd.description // Always use the current description
      };
      
      // Double-check that the description is preserved
      if (safeUpdatedPrd.description !== prd.description) {
        console.error("Description protection failed - forcing correct description");
        safeUpdatedPrd.description = prd.description;
      }
      
      console.log("Sending update with description:", {
        original: prd.description,
        preserved: safeUpdatedPrd.description
      });
      
      // Save updated PRD
      const savedPrd = await savePRD(safeUpdatedPrd);

      // Triple-check the description was preserved in the response
      if (savedPrd.description !== prd.description) {
        console.error("Description changed after save - this should never happen!");
        savedPrd.description = prd.description;
      }

      // Update local state
      setPrd(savedPrd);

      // Update parent component
      onUpdatePrd(savedPrd);

      // Close dialog
      setIsRegenerateDialogOpen(false);
      setActiveSection(null);

      toast({
        title: "Section Updated",
        description: "The PRD section has been regenerated successfully",
      });
    } catch (error) {
      console.error("Error updating PRD:", error);
      
      // More descriptive error message
      let errorMessage = "Failed to update the PRD section";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </motion.div>
      </div>
    )
  }

  if (!prd) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center max-w-md"
        >
          {!sidebarOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebar}
              className="mb-6 h-10 w-10 rounded-full border border-gray-200 mx-auto"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </Button>
          )}
          <h3 className="text-xl font-medium text-gray-800 mb-3">No PRD Selected</h3>
          <p className="text-gray-500">
            Select a PRD from the sidebar or create a new one to get started.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen pt-16 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          {!sidebarOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebar}
              className="mr-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {prd?.title || "No PRD Selected"}
          </h1>
        </div>
        
        {/* Export buttons with dark mode */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(prd.markdown, "Markdown")}
            disabled={!prd}
            className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={downloadMarkdown}
            disabled={!prd}
            className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <FileText className="h-4 w-4" />
            <span>Markdown</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={downloadJson}
            disabled={!prd}
            className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <FileJson className="h-4 w-4" />
            <span>JSON</span>
          </Button>
        </div>
      </div>
      
      {/* Tabs with dark mode */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="border-b px-6 dark:border-gray-800">
          <TabsList className="mt-0 mb-0 bg-transparent dark:bg-transparent border-0">
            <TabsTrigger 
              value="visual" 
              className={`rounded-none border-b-2 pt-3 pb-2 px-6 data-[state=active]:border-primary ${
                activeTab === "visual" 
                ? "border-primary text-primary font-medium" 
                : "border-transparent text-gray-500 dark:text-gray-400"
              }`}
            >
              Visual
            </TabsTrigger>
            <TabsTrigger 
              value="markdown" 
              className={`rounded-none border-b-2 pt-3 pb-2 px-6 data-[state=active]:border-primary ${
                activeTab === "markdown" 
                ? "border-primary text-primary font-medium" 
                : "border-transparent text-gray-500 dark:text-gray-400"
              }`}
            >
              Markdown
            </TabsTrigger>
            <TabsTrigger 
              value="json" 
              className={`rounded-none border-b-2 pt-3 pb-2 px-6 data-[state=active]:border-primary ${
                activeTab === "json" 
                ? "border-primary text-primary font-medium" 
                : "border-transparent text-gray-500 dark:text-gray-400"
              }`}
            >
              JSON
            </TabsTrigger>
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "visual" && (
            <motion.div
              key="visual-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-hidden p-6 relative"
            >
              <ScrollArea className="h-full pr-4">
                <PRDVisualization 
                  prdData={prd.json_data} 
                  onSectionClick={handleSectionClick} 
                  isEditable={true} 
                />
              </ScrollArea>
            </motion.div>
          )}

          {activeTab === "markdown" && (
            <motion.div
              key="markdown-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-hidden p-6"
            >
              <Card className="h-full overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800">
                <ScrollArea className="h-full">
                  <pre className="p-6 font-mono text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">{prd.markdown}</pre>
                </ScrollArea>
              </Card>
            </motion.div>
          )}

          {activeTab === "json" && (
            <motion.div
              key="json-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-hidden p-6"
            >
              <Card className="h-full overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm dark:bg-gray-800">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <JsonViewer data={prd.json_data} />
                  </div>
                </ScrollArea>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
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

