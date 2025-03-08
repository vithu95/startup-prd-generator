// Direct API integration with Gemini 2.0 Flash
export async function generatePRDWithGemini(idea: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
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
    
    Return the response as a JSON object with the following structure:
    {
      "startup_name": "Name of the startup",
      "overview": {
        "idea_summary": "Brief summary of the idea",
        "problem_statement": "Problem the startup solves",
        "solution": "How the startup solves the problem",
        "target_audience": ["Audience 1", "Audience 2", ...]
      },
      "features": {
        "core_features": ["Feature 1", "Feature 2", ...],
        "user_roles": {
          "guest": "Description of guest role",
          "registered": "Description of registered user role",
          "premium": "Description of premium user role"
        },
        "monetization_model": ["Model 1", "Model 2", ...]
      },
      "tech_stack": {
        "frontend": "Frontend technologies",
        "backend": "Backend technologies",
        "database": "Database technologies",
        "auth": "Authentication method"
      },
      "ai_integration": {
        "model": "AI model used (if applicable)",
        "features": ["AI Feature 1", "AI Feature 2", ...]
      },
      "ui_ux_design": {
        "style": "Design style description",
        "key_elements": ["Element 1", "Element 2", ...]
      },
      "deployment": {
        "hosting": "Hosting platform",
        "scalability": ["Scalability feature 1", "Scalability feature 2", ...]
      },
      "roadmap": {
        "mvp": "MVP description",
        "ui_ux": "UI/UX development plan",
        "ai_integration": "AI integration plan (if applicable)",
        "monetization": "Monetization plan",
        "launch": "Launch strategy"
      }
    }
    
    Ensure the JSON is valid and properly formatted.
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
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    // Extract the text from the response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error("No text content in the response")
    }

    // Extract the JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)
    let jsonData

    if (jsonMatch) {
      try {
        jsonData = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } catch (e) {
        console.error("Error parsing JSON:", e)
        throw new Error("Failed to parse JSON from Gemini response")
      }
    } else {
      throw new Error("No JSON found in Gemini response")
    }

    // Generate markdown from the JSON
    const markdown = generateMarkdownFromJson(jsonData)

    return {
      markdown,
      json: jsonData,
    }
  } catch (error) {
    console.error("Error generating PRD with Gemini:", error)
    throw error
  }
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

