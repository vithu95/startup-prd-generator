"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Layers, Users, DollarSign, Code, Palette, Cloud, RocketIcon, Edit } from "lucide-react"

interface PRDVisualizationProps {
  prdData: any
  onSectionClick?: (section: string) => void
  isEditable?: boolean
}

export function PRDVisualization({ prdData, onSectionClick, isEditable = false }: PRDVisualizationProps) {
  if (!prdData) return null

  const SectionHeading = ({
    icon,
    title,
    section,
  }: {
    icon: React.ReactNode
    title: string
    section: string
  }) => (
    <CardTitle className="flex items-center justify-between">
      <div className="flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </div>
      {isEditable && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onSectionClick?.(section)}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit {title}</span>
        </Button>
      )}
    </CardTitle>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{prdData.startup_name}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{prdData.overview.idea_summary}</p>
      </div>

      {/* Overview Section */}
      <Card>
        <CardHeader>
          <SectionHeading
            icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
            title="Overview"
            section="overview"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Problem Statement</h3>
            <p className="text-gray-600">{prdData.overview.problem_statement}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Solution</h3>
            <p className="text-gray-600">{prdData.overview.solution}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Target Audience</h3>
            <div className="flex flex-wrap gap-2">
              {prdData.overview.target_audience.map((audience: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {audience}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <SectionHeading
            icon={<Layers className="h-5 w-5 text-primary" />}
            title="Features & Functionality"
            section="features"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Core Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {prdData.features.core_features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 mr-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">User Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    Guest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">{prdData.features.user_roles.guest}</CardDescription>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Users className="mr-2 h-4 w-4 text-blue-500" />
                    Registered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">{prdData.features.user_roles.registered}</CardDescription>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    Premium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">{prdData.features.user_roles.premium}</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Monetization Model</h3>
            <div className="flex flex-wrap gap-2">
              {prdData.features.monetization_model.map((model: string, index: number) => (
                <Badge key={index} variant="outline" className="flex items-center">
                  <DollarSign className="mr-1 h-3 w-3" />
                  {model}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack & AI Integration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <SectionHeading
              icon={<Code className="h-5 w-5 text-primary" />}
              title="Technology Stack"
              section="tech_stack"
            />
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="font-medium min-w-24">Frontend:</span>
                <span className="text-gray-600">{prdData.tech_stack.frontend}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium min-w-24">Backend:</span>
                <span className="text-gray-600">{prdData.tech_stack.backend}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium min-w-24">Database:</span>
                <span className="text-gray-600">{prdData.tech_stack.database}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium min-w-24">Auth:</span>
                <span className="text-gray-600">{prdData.tech_stack.auth}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionHeading
              icon={<Layers className="h-5 w-5 text-primary" />}
              title="AI Integration"
              section="ai_integration"
            />
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="font-medium min-w-24">Model:</span>
                <span className="text-gray-600">{prdData.ai_integration.model}</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium mb-2">Features:</span>
                <ul className="space-y-1 text-gray-600">
                  {prdData.ai_integration.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 mr-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* UI/UX & Deployment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <SectionHeading
              icon={<Palette className="h-5 w-5 text-primary" />}
              title="UI/UX Design"
              section="ui_ux_design"
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Style:</span>
                <p className="text-gray-600 mt-1">{prdData.ui_ux_design.style}</p>
              </div>
              <div>
                <span className="font-medium mb-2 block">Key Elements:</span>
                <ul className="space-y-1 text-gray-600">
                  {prdData.ui_ux_design.key_elements.map((element: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 mr-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </span>
                      {element}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionHeading icon={<Cloud className="h-5 w-5 text-primary" />} title="Deployment" section="deployment" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Hosting:</span>
                <p className="text-gray-600 mt-1">{prdData.deployment.hosting}</p>
              </div>
              <div>
                <span className="font-medium mb-2 block">Scalability:</span>
                <ul className="space-y-1 text-gray-600">
                  {prdData.deployment.scalability.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 mr-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap */}
      <Card>
        <CardHeader>
          <SectionHeading icon={<RocketIcon className="h-5 w-5 text-primary" />} title="Roadmap" section="roadmap" />
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <ul className="space-y-6 relative">
              <li className="ml-10 relative">
                <div className="absolute -left-10 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
                  1
                </div>
                <h3 className="font-medium">MVP</h3>
                <p className="text-gray-600 mt-1">{prdData.roadmap.mvp}</p>
              </li>
              <li className="ml-10 relative">
                <div className="absolute -left-10 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
                  2
                </div>
                <h3 className="font-medium">UI/UX</h3>
                <p className="text-gray-600 mt-1">{prdData.roadmap.ui_ux}</p>
              </li>
              <li className="ml-10 relative">
                <div className="absolute -left-10 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
                  3
                </div>
                <h3 className="font-medium">AI Integration</h3>
                <p className="text-gray-600 mt-1">{prdData.roadmap.ai_integration}</p>
              </li>
              <li className="ml-10 relative">
                <div className="absolute -left-10 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
                  4
                </div>
                <h3 className="font-medium">Monetization</h3>
                <p className="text-gray-600 mt-1">{prdData.roadmap.monetization}</p>
              </li>
              <li className="ml-10 relative">
                <div className="absolute -left-10 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
                  5
                </div>
                <h3 className="font-medium">Launch</h3>
                <p className="text-gray-600 mt-1">{prdData.roadmap.launch}</p>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

