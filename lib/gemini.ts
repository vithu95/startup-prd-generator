// Direct API integration with Gemini 2.0 Flash
export async function generatePRDWithGemini(idea: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured")
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    // Create a prompt for the Gemini model
    const prompt = `
    Generate a comprehensive Product Requirements Document (PRD) for the following startup idea:
    
    "${idea}"
    
    The PRD should include the following sections:
    1. Overview (idea summary, problem statement, solution, target audience)
    2. Features & Functionality (core features, user roles, monetization model)
    3. Technology Stack (frontend, backend, database, auth)
    4. AI Integration (if applicable)
    5. UI/UX Design (style, key elements)
    6. Deployment (hosting, scalability)
    7. Roadmap (mvp, ui/ux, ai integration, monetization, launch)
    
    Return ONLY a valid JSON object with no additional text, formatted exactly like this:
    {
      "startup_name": "Name of the startup",
      "overview": {
        "idea_summary": "Brief summary of the idea",
        "problem_statement": "Problem the startup solves",
        "solution": "How the startup solves the problem",
        "target_audience": ["Audience 1", "Audience 2"]
      },
      "features": {
        "core_features": ["Feature 1", "Feature 2"],
        "user_roles": {
          "guest": "Description of guest role",
          "registered": "Description of registered user role",
          "premium": "Description of premium user role"
        },
        "monetization_model": ["Model 1", "Model 2"]
      },
      "tech_stack": {
        "frontend": "Frontend technologies",
        "backend": "Backend technologies",
        "database": "Database technologies",
        "auth": "Authentication method"
      },
      "ai_integration": {
        "model": "AI model used (if applicable)",
        "features": ["AI Feature 1", "AI Feature 2"]
      },
      "ui_ux_design": {
        "style": "Design style description",
        "key_elements": ["Element 1", "Element 2"]
      },
      "deployment": {
        "hosting": "Hosting platform",
        "scalability": ["Scalability feature 1", "Scalability feature 2"]
      },
      "roadmap": {
        "mvp": "MVP description",
        "ui_ux": "UI/UX development plan",
        "ai_integration": "AI integration plan (if applicable)",
        "monetization": "Monetization plan",
        "launch": "Launch strategy"
      }
    }
    
    IMPORTANT: Return ONLY the JSON object. Do not include any other text, markdown formatting, or code blocks.
    `

    // Make the API request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API error response:", errorData)
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Extract the text from the response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!text) {
      console.error("Empty response from Gemini:", data)
      throw new Error("No text content in the Gemini response")
    }

    // Try to parse the response as JSON
    try {
      // First, try to parse the text directly
      let jsonData = JSON.parse(text)
      
      // Validate the required fields
      if (!validatePRDJson(jsonData)) {
        throw new Error("Invalid PRD JSON structure")
      }

      // Generate markdown from the JSON
      const markdown = generateMarkdownFromJson(jsonData)

      return {
        markdown,
        json: jsonData,
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
      console.log("Raw Gemini response:", text)
      
      // Try to extract JSON from the text if direct parsing failed
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const jsonData = JSON.parse(jsonMatch[0])
          if (validatePRDJson(jsonData)) {
            const markdown = generateMarkdownFromJson(jsonData)
            return { markdown, json: jsonData }
          }
        } catch (e) {
          console.error("Error parsing extracted JSON:", e)
        }
      }
      
      // If all parsing attempts fail, throw an error
      throw new Error("Failed to parse valid JSON from Gemini response")
    }
  } catch (error) {
    console.error("Error generating PRD with Gemini:", error)
    throw error
  }
}

// Validate that the JSON has the required structure
function validatePRDJson(json: any): boolean {
  const requiredFields = [
    "startup_name",
    "overview",
    "features",
    "tech_stack",
    "ui_ux_design",
    "deployment",
    "roadmap"
  ]

  const requiredOverviewFields = [
    "idea_summary",
    "problem_statement",
    "solution",
    "target_audience"
  ]

  const requiredFeaturesFields = [
    "core_features",
    "user_roles",
    "monetization_model"
  ]

  // Check top-level fields
  if (!requiredFields.every(field => json.hasOwnProperty(field))) {
    return false
  }

  // Check overview fields
  if (!requiredOverviewFields.every(field => json.overview.hasOwnProperty(field))) {
    return false
  }

  // Check features fields
  if (!requiredFeaturesFields.every(field => json.features.hasOwnProperty(field))) {
    return false
  }

  // Check arrays
  if (!Array.isArray(json.overview.target_audience) ||
      !Array.isArray(json.features.core_features) ||
      !Array.isArray(json.features.monetization_model)) {
    return false
  }

  return true
}

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

/**
 * Helper function to extract a valid JSON subset from a potentially malformed JSON string
 * This is a simplified approach for emergency fallback
 */
function extractValidJson(jsonString) {
  // Ensure we have opening and closing braces
  if (!jsonString.trim().startsWith('{') || !jsonString.trim().endsWith('}')) {
    // If not a valid JSON object format, return a minimal valid JSON object
    return '{"startup_name":"Generated PRD","overview":{"idea_summary":"Generated from provided idea"}}';
  }
  
  try {
    // Start with a minimal valid structure
    const safeJson = {
      "startup_name": "Generated PRD",
      "overview": {
        "idea_summary": "Generated from provided idea",
        "problem_statement": "Problem description",
        "solution": "Solution description",
        "target_audience": ["Target audience"]
      },
      "features": {
        "core_features": ["Core feature"],
        "user_roles": {
          "guest": "Guest role",
          "registered": "Registered role",
          "premium": "Premium role"
        },
        "monetization_model": ["Monetization model"]
      },
      "tech_stack": {
        "frontend": "Frontend tech",
        "backend": "Backend tech",
        "database": "Database tech",
        "auth": "Auth method"
      },
      "ai_integration": {
        "model": "AI model",
        "features": ["AI feature"]
      },
      "ui_ux_design": {
        "style": "Design style",
        "key_elements": ["Design element"]
      },
      "deployment": {
        "hosting": "Hosting solution",
        "scalability": ["Scalability approach"]
      },
      "roadmap": {
        "mvp": "MVP plan",
        "ui_ux": "UI/UX plan",
        "ai_integration": "AI integration plan",
        "monetization": "Monetization plan",
        "launch": "Launch plan"
      }
    };
    
    // Try to extract startup name
    const nameMatch = jsonString.match(/"startup_name"\s*:\s*"([^"]+)"/);
    if (nameMatch && nameMatch[1]) {
      safeJson.startup_name = nameMatch[1];
    }
    
    // Try to extract idea summary
    const summaryMatch = jsonString.match(/"idea_summary"\s*:\s*"([^"]+)"/);
    if (summaryMatch && summaryMatch[1]) {
      safeJson.overview.idea_summary = summaryMatch[1];
    }
    
    return JSON.stringify(safeJson);
  } catch (e) {
    console.error("Error in extractValidJson:", e);
    // Return absolute minimal valid JSON as last resort
    return '{"startup_name":"Generated PRD","overview":{"idea_summary":"Generated from provided idea"}}';
  }
}

