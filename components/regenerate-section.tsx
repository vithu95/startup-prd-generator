"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { PRDDocument } from "@/lib/supabase"
import { generatePRD } from "@/lib/generate-prd"

interface RegenerateSectionProps {
  isOpen: boolean
  onClose: () => void
  prd: PRDDocument
  section: string | null
  onUpdate: (updatedPrd: PRDDocument) => void
}

export function RegenerateSection({ isOpen, onClose, prd, section, onUpdate }: RegenerateSectionProps) {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState("")
  const { toast } = useToast()

  // Get section name for display
  const getSectionName = () => {
    switch (section) {
      case "overview":
        return "Overview"
      case "features":
        return "Features & Functionality"
      case "tech_stack":
        return "Technology Stack"
      case "ai_integration":
        return "AI Integration"
      case "ui_ux_design":
        return "UI/UX Design"
      case "deployment":
        return "Deployment"
      case "roadmap":
        return "Roadmap"
      default:
        return "Section"
    }
  }

  // Get current section content
  const getSectionContent = () => {
    if (!prd || !section) return ""

    switch (section) {
      case "overview":
        return `Problem: ${prd.json_data.overview.problem_statement}\nSolution: ${prd.json_data.overview.solution}\nTarget audience: ${prd.json_data.overview.target_audience.join(", ")}`
      case "features":
        return `Core features: ${prd.json_data.features.core_features.join(", ")}\nUser roles: ${JSON.stringify(prd.json_data.features.user_roles)}\nMonetization: ${prd.json_data.features.monetization_model.join(", ")}`
      case "tech_stack":
        return `Frontend: ${prd.json_data.tech_stack.frontend}\nBackend: ${prd.json_data.tech_stack.backend}\nDatabase: ${prd.json_data.tech_stack.database}\nAuth: ${prd.json_data.tech_stack.auth}`
      case "ai_integration":
        return `Model: ${prd.json_data.ai_integration.model}\nFeatures: ${prd.json_data.ai_integration.features.join(", ")}`
      case "ui_ux_design":
        return `Style: ${prd.json_data.ui_ux_design.style}\nKey elements: ${prd.json_data.ui_ux_design.key_elements.join(", ")}`
      case "deployment":
        return `Hosting: ${prd.json_data.deployment.hosting}\nScalability: ${prd.json_data.deployment.scalability.join(", ")}`
      case "roadmap":
        return `MVP: ${prd.json_data.roadmap.mvp}\nUI/UX: ${prd.json_data.roadmap.ui_ux}\nAI Integration: ${prd.json_data.roadmap.ai_integration}\nMonetization: ${prd.json_data.roadmap.monetization}\nLaunch: ${prd.json_data.roadmap.launch}`
      default:
        return ""
    }
  }

  const handleRegenerate = async () => {
    if (!prd || !section) return

    setLoading(true)
    try {
      // IMPORTANT: Store the original values to ensure nothing unexpected changes
      const originalDescription = prd.description;
      const originalTitle = prd.title;
      const originalId = prd.id;
      const originalUserId = prd.user_id;
      const originalCreatedAt = prd.created_at;
      
      // Create a deep copy of the original JSON data to modify
      const originalJsonData = JSON.parse(JSON.stringify(prd.json_data));
      
      // Create a prompt for regenerating just this section
      const sectionPrompt = `
        I need to improve the "${getSectionName()}" section of a product requirements document for "${originalTitle}" based on this feedback:
        "${feedback}"
        
        Current content for this section:
        ${getSectionContent()}
        
        IMPORTANT: Your response should ONLY contain valid JSON for the ${section} section with the same structure but improved content.
        
        For example, if I'm updating the "overview" section, respond ONLY with:
        {
          "idea_summary": "improved summary here",
          "problem_statement": "improved problem statement here",
          "solution": "improved solution here",
          "target_audience": ["audience 1", "audience 2"]
        }
      `

      console.log(`Generating improvements for ${section} section`);
      
      // Generate content for this section
      const result = await generatePRD(sectionPrompt);
      
      console.log("Received response:", result);
      
      // New approach: Don't use the response directly for the entire document
      // Instead, surgically extract only the part we need
      let updatedSectionData = null;
      
      // Extract just the section we need from the response
      if (section === "overview" && result.json && result.json.overview) {
        updatedSectionData = result.json.overview;
      } else if (section === "features" && result.json && result.json.features) {
        updatedSectionData = result.json.features;
      } else if (section === "tech_stack" && result.json && result.json.tech_stack) {
        updatedSectionData = result.json.tech_stack;
      } else if (section === "ai_integration" && result.json && result.json.ai_integration) {
        updatedSectionData = result.json.ai_integration;
      } else if (section === "ui_ux_design" && result.json && result.json.ui_ux_design) {
        updatedSectionData = result.json.ui_ux_design;
      } else if (section === "deployment" && result.json && result.json.deployment) {
        updatedSectionData = result.json.deployment;
      } else if (section === "roadmap" && result.json && result.json.roadmap) {
        updatedSectionData = result.json.roadmap;
      } else if (result.json) {
        // Try to find the section data directly in the response JSON
        updatedSectionData = result.json;
      }
      
      if (!updatedSectionData) {
        console.warn("Could not find the updated section data in the response");
        toast({
          title: "Error",
          description: "The AI response didn't contain valid data for this section. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Create a new copy of the JSON data with only the specific section updated
      const updatedJsonData = {...originalJsonData};
      
      // Update only the specific section
      if (section === "overview") {
        updatedJsonData.overview = updatedSectionData;
      } else if (section === "features") {
        updatedJsonData.features = updatedSectionData;
      } else if (section === "tech_stack") {
        updatedJsonData.tech_stack = updatedSectionData;
      } else if (section === "ai_integration") {
        updatedJsonData.ai_integration = updatedSectionData;
      } else if (section === "ui_ux_design") {
        updatedJsonData.ui_ux_design = updatedSectionData;
      } else if (section === "deployment") {
        updatedJsonData.deployment = updatedSectionData;
      } else if (section === "roadmap") {
        updatedJsonData.roadmap = updatedSectionData;
      }
      
      console.log(`Updated ${section} section in JSON data`);
      
      // Generate the markdown from the updated JSON data
      const updatedMarkdown = generateMarkdownFromJson(updatedJsonData);
      
      // Create the fully updated PRD document, explicitly preserving all original metadata
      const updatedPrd: PRDDocument = {
        id: originalId,
        user_id: originalUserId,
        title: originalTitle,
        description: originalDescription,
        markdown: updatedMarkdown,
        json_data: updatedJsonData,
        created_at: originalCreatedAt
      };
      
      console.log("Final updated PRD:", {
        id: updatedPrd.id,
        title: updatedPrd.title,
        description: updatedPrd.description,
        section_updated: section
      });

      // Call the update handler
      onUpdate(updatedPrd);

      // Reset state
      setFeedback("");
      
      toast({
        title: "Section Updated",
        description: `The ${getSectionName()} section has been improved based on your feedback.`,
      });
    } catch (error) {
      console.error("Error regenerating section:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate the section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Helper function to generate markdown from JSON
  function generateMarkdownFromJson(json: any) {
    return `# ${json.startup_name}

## 1. Overview
**Idea Summary:** ${json.overview.idea_summary}  

**Problem Statement:** ${json.overview.problem_statement}  

**Solution:** ${json.overview.solution}  

**Target Audience:**  
${json.overview.target_audience.map((audience: string) => `- ${audience}  `).join("\n")}  

---

## 2. Features & Functionality
### **Core Features**
${json.features.core_features.map((feature: string) => `- **${feature}**  `).join("\n")}  

### **User Roles**
- **Guest Users**: ${json.features.user_roles.guest}  
- **Registered Users**: ${json.features.user_roles.registered}  
- **Premium Users**: ${json.features.user_roles.premium}  

### **Monetization Model**
${json.features.monetization_model.map((model: string) => `- **${model}**  `).join("\n")}  

---

## 3. Technology Stack
- **Frontend:** ${json.tech_stack.frontend}  
- **Backend:** ${json.tech_stack.backend}  
- **Database:** ${json.tech_stack.database}  
- **Auth:** ${json.tech_stack.auth}  

---

## 4. AI Integration
- **AI Model:** ${json.ai_integration.model}  
- **Use Case:** ${json.ai_integration.features[0]}  
- **Customization Options:** ${json.ai_integration.features[2] || json.ai_integration.features[1]}  

---

## 5. UI/UX Design
- **Style:** ${json.ui_ux_design.style}  
- **Key Elements:**  
${json.ui_ux_design.key_elements.map((element: string) => `  - ${element}  `).join("\n")}  

---

## 6. Deployment
- **Hosting:** ${json.deployment.hosting}  
- **Scalability:**  
${json.deployment.scalability.map((item: string) => `  - ${item}  `).join("\n")}  

---

## 7. Roadmap
1. **MVP:** ${json.roadmap.mvp}  
2. **UI/UX:** ${json.roadmap.ui_ux}  
3. **AI Integration:** ${json.roadmap.ai_integration}  
4. **Monetization:** ${json.roadmap.monetization}  
5. **Launch:** ${json.roadmap.launch}  
`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Regenerate {getSectionName()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-content">Current Content</Label>
            <div className="p-3 rounded-md bg-gray-50 text-sm text-gray-700 whitespace-pre-wrap min-h-20">
              {getSectionContent()}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback for Improvement</Label>
            <Textarea
              id="feedback"
              placeholder="Provide specific feedback on how to improve this section..."
              className="min-h-32"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleRegenerate} disabled={loading || !feedback.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              "Regenerate Section"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

