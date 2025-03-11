"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Loader2, Download, Copy, Save, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generatePRD, savePRD } from "@/lib/generate-prd"
import { useAuth } from "@/context/auth-context"
import { getRandomStartupIdea } from "@/lib/random-ideas"
import { PRDVisualization } from "./prd-visualization"

export function IdeaForm() {
  const [idea, setIdea] = useState("")
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [prd, setPrd] = useState<string | null>(null)
  const [prdJson, setPrdJson] = useState<any | null>(null)
  const { toast } = useToast()
  const { user, signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim()) {
      toast({
        title: "Please enter your startup idea",
        variant: "destructive",
      })
      return
    }

    // If user is not logged in, redirect to Google sign-in
    if (!user) {
      // Save the idea in localStorage so we can retrieve it after login
      localStorage.setItem('pendingPrdIdea', idea);
      // Create a redirect URL to return to the PRD generation
      const redirectUrl = `${window.location.origin}/generator/continue`;
      
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

    setLoading(true)
    try {
      const result = await generatePRD(idea)
      setPrd(result.markdown)
      setPrdJson(result.json)
      setTitle(result.json.startup_name || "Untitled PRD")
      toast({
        title: "PRD Generated Successfully",
        description: "Your Product Requirements Document is ready!",
      })
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
      // Save the random idea in localStorage so we can retrieve it after login
      localStorage.setItem('pendingPrdIdea', randomIdea);
      localStorage.setItem('pendingPrdFeelingLucky', 'true');
      // Create a redirect URL to return to the PRD generation
      const redirectUrl = `${window.location.origin}/generator/continue`;
      
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

    // Automatically generate PRD with the random idea
    setLoading(true)
    try {
      const result = await generatePRD(randomIdea)
      setPrd(result.markdown)
      setPrdJson(result.json)
      setTitle(result.json.startup_name || "Untitled PRD")
      toast({
        title: "Random PRD Generated Successfully",
        description: "Your random Product Requirements Document is ready!",
      })
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

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to save PRDs",
        variant: "destructive",
      })
      router.push("/auth/sign-in")
      return
    }

    if (!prd || !prdJson) {
      toast({
        title: "No PRD to save",
        description: "Please generate a PRD first",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const savedPrd = await savePRD({
        user_id: user.id,
        title: title,
        description: prdJson.overview.idea_summary || idea,
        markdown: prd,
        json_data: prdJson,
      })

      toast({
        title: "PRD Saved Successfully",
        description: "Your PRD has been saved to your dashboard",
      })

      // Redirect to the PRD view
      router.push(`/prd/${savedPrd.id}`)
    } catch (error) {
      toast({
        title: "Error saving PRD",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The PRD has been copied to your clipboard",
    })
  }

  const downloadMarkdown = () => {
    if (!prd) return

    const blob = new Blob([prd], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadJson = () => {
    if (!prdJson) return

    const blob = new Blob([JSON.stringify(prdJson, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section id="generator" className="py-8 container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Generate Your PRD</h2>

        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Startup Idea Generator</CardTitle>
            <CardDescription>Describe your startup idea and we'll generate a comprehensive PRD for you</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="idea">Describe your startup idea</Label>
                  <Textarea
                    id="idea"
                    placeholder="E.g., A SaaS platform that helps remote teams track their productivity and well-being..."
                    className="h-24"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="flex-1" disabled={loading || !idea.trim()}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating PRD...
                      </>
                    ) : (
                      "Generate PRD"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleFeelingLucky}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        I'm Feeling Lucky
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {loading && (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Generating Your PRD</h3>
              <p className="text-gray-500 text-center max-w-md">
                Our AI is crafting a comprehensive Product Requirements Document based on your idea. This may take a
                moment...
              </p>
            </div>
          </Card>
        )}

        {!loading && prdJson && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="w-full">
                <Label htmlFor="title" className="mb-1 block">
                  PRD Title
                </Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-md" />
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(prd!)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="visual">
              <TabsList className="mb-4">
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="visual">
                <PRDVisualization prdData={prdJson} />
              </TabsContent>

              <TabsContent value="markdown">
                <Card>
                  <CardContent className="p-4 font-mono text-sm max-h-[600px] overflow-y-auto whitespace-pre-wrap">
                    {prd}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="json">
                <Card>
                  <CardContent className="p-4 font-mono text-sm max-h-[600px] overflow-y-auto whitespace-pre-wrap">
                    {JSON.stringify(prdJson, null, 2)}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </section>
  )
}

