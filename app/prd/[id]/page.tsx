"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { getPRDById } from "@/lib/generate-prd"
import type { PRDDocument } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Loader2, ArrowLeft, Download, Copy } from "lucide-react"
import { PRDVisualization } from "@/components/prd-visualization"

export default function PRDView({ params }: { params: { id: string } }) {
  const [prd, setPrd] = useState<PRDDocument | null>(null)
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
    const fetchPRD = async () => {
      if (user) {
        try {
          const data = await getPRDById(params.id)
          setPrd(data)
        } catch (error) {
          console.error("Error fetching PRD:", error)
          toast({
            title: "Error",
            description: "Failed to fetch the PRD. Please try again.",
            variant: "destructive",
          })
          router.push("/dashboard")
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      fetchPRD()
    }
  }, [user, params.id, router, toast])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The PRD has been copied to your clipboard",
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

  if (!user) {
    router.push("/generator")
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {prd && (
          <>
            <h1 className="text-3xl font-bold mb-4">{prd.title}</h1>
            <p className="text-gray-600 mb-6">{prd.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(prd.markdown)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Markdown
              </Button>
              <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                <Download className="mr-2 h-4 w-4" />
                Download Markdown
              </Button>
              <Button variant="outline" size="sm" onClick={downloadJson}>
                <Download className="mr-2 h-4 w-4" />
                Download JSON
              </Button>
            </div>

            <Tabs defaultValue="visual">
              <TabsList className="mb-4">
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="visual">
                <PRDVisualization prdData={prd.json_data} />
              </TabsContent>

              <TabsContent value="markdown">
                <Card>
                  <CardContent className="p-4 font-mono text-sm max-h-[600px] overflow-y-auto whitespace-pre-wrap">
                    {prd.markdown}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="json">
                <Card>
                  <CardContent className="p-4 font-mono text-sm max-h-[600px] overflow-y-auto whitespace-pre-wrap">
                    {JSON.stringify(prd.json_data, null, 2)}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  )
}

