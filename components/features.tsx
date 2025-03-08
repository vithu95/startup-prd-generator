import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Sparkles, Download, Users, Repeat, Database } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: "AI-Powered PRD Generation",
      description: "Transform simple ideas into comprehensive Product Requirements Documents in seconds.",
    },
    {
      icon: <Download className="h-10 w-10 text-primary" />,
      title: "Multiple Export Formats",
      description: "Download your PRDs in Markdown or JSON format for easy integration with development tools.",
    },
    {
      icon: <Repeat className="h-10 w-10 text-primary" />,
      title: "Idea Refinement",
      description: "Refine and regenerate your PRDs with additional details and customizations.",
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Example Library",
      description: "Browse through pre-generated startup PRDs for inspiration and guidance.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "User Roles",
      description: "Different access levels for guests, registered users, and premium subscribers.",
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: "Save & Organize",
      description: "Store your generated PRDs and organize them into projects and categories.",
    },
  ]

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Features</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Our platform offers everything you need to transform your startup ideas into structured documents
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

