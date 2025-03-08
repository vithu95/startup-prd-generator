export function generateFallbackPRD(idea: string) {
  const startupName = idea.length > 30 ? idea.substring(0, 30).split(" ").slice(0, -1).join(" ") + "..." : idea

  const jsonData = {
    startup_name: startupName,
    overview: {
      idea_summary: `A SaaS platform that ${idea.toLowerCase()}`,
      problem_statement: "Many users struggle with this problem and need an efficient solution.",
      solution: "Our platform provides an intuitive and powerful solution to address this need.",
      target_audience: ["Small to medium businesses", "Individual professionals", "Enterprise customers"],
    },
    features: {
      core_features: [
        "User-friendly dashboard",
        "Data analytics and reporting",
        "Integration with existing tools",
        "Mobile application",
      ],
      user_roles: {
        guest: "Limited access to basic features",
        registered: "Full access to standard features",
        premium: "Access to advanced features and priority support",
      },
      monetization_model: ["Freemium", "Subscription-based", "Enterprise pricing"],
    },
    tech_stack: {
      frontend: "Next.js, React, Tailwind CSS",
      backend: "Node.js, Express",
      database: "PostgreSQL, Redis",
      auth: "OAuth 2.0, JWT",
    },
    ai_integration: {
      model: "Custom ML models",
      features: ["Predictive analytics", "Natural language processing", "Recommendation engine"],
    },
    ui_ux_design: {
      style: "Modern, minimalist design with intuitive navigation",
      key_elements: ["Responsive layout", "Dark/light mode", "Customizable dashboard", "Accessible design"],
    },
    deployment: {
      hosting: "AWS, Vercel",
      scalability: ["Containerization with Docker", "Kubernetes orchestration", "CDN for static assets"],
    },
    roadmap: {
      mvp: "Launch core features with basic functionality",
      ui_ux: "Refine user experience based on initial feedback",
      ai_integration: "Implement AI features for enhanced functionality",
      monetization: "Introduce premium tiers and payment processing",
      launch: "Full market launch with marketing campaign",
    },
  }

  // Generate markdown from the JSON
  const markdown = `# ${jsonData.startup_name}

## 1. Overview
**Idea Summary:** ${jsonData.overview.idea_summary}  

**Problem Statement:** ${jsonData.overview.problem_statement}  

**Solution:** ${jsonData.overview.solution}  

**Target Audience:**  
${jsonData.overview.target_audience.map((audience) => `- ${audience}  `).join("\n")}  

---

## 2. Features & Functionality
### **Core Features**
${jsonData.features.core_features.map((feature) => `- **${feature}**  `).join("\n")}  

### **User Roles**
- **Guest Users**: ${jsonData.features.user_roles.guest}  
- **Registered Users**: ${jsonData.features.user_roles.registered}  
- **Premium Users**: ${jsonData.features.user_roles.premium}  

### **Monetization Model**
${jsonData.features.monetization_model.map((model) => `- **${model}**  `).join("\n")}  

---

## 3. Technology Stack
- **Frontend:** ${jsonData.tech_stack.frontend}  
- **Backend:** ${jsonData.tech_stack.backend}  
- **Database:** ${jsonData.tech_stack.database}  
- **Auth:** ${jsonData.tech_stack.auth}  

---

## 4. AI Integration
- **AI Model:** ${jsonData.ai_integration.model}  
- **Use Case:** ${jsonData.ai_integration.features[0]}  
- **Customization Options:** ${jsonData.ai_integration.features[2]}  

---

## 5. UI/UX Design
- **Style:** ${jsonData.ui_ux_design.style}  
- **Key Elements:**  
${jsonData.ui_ux_design.key_elements.map((element) => `  - ${element}  `).join("\n")}  

---

## 6. Deployment
- **Hosting:** ${jsonData.deployment.hosting}  
- **Scalability:**  
${jsonData.deployment.scalability.map((item) => `  - ${item}  `).join("\n")}  

---

## 7. Roadmap
1. **MVP:** ${jsonData.roadmap.mvp}  
2. **UI/UX:** ${jsonData.roadmap.ui_ux}  
3. **AI Integration:** ${jsonData.roadmap.ai_integration}  
4. **Monetization:** ${jsonData.roadmap.monetization}  
5. **Launch:** ${jsonData.roadmap.launch}  
`

  return {
    markdown,
    json: jsonData,
  }
}

