import { type NextRequest, NextResponse } from "next/server"
import { generatePRDWithGemini } from "@/lib/gemini"
import { generateFallbackPRD } from "@/lib/fallback-prd"

export async function POST(request: NextRequest) {
  try {
    // First try to parse the request body
    let idea: string
    try {
      const body = await request.json()
      idea = body.idea

      if (!idea || typeof idea !== "string") {
        return NextResponse.json(
          { 
            error: "Invalid request. Please provide a valid idea.",
            requestSucceeded: false
          }, 
          { status: 400 }
        )
      }
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        { 
          error: "Invalid request format. Please provide a valid JSON body.",
          requestSucceeded: false
        }, 
        { status: 400 }
      )
    }

    // Try generating with Gemini first
    try {
      console.log("Attempting to generate PRD with Gemini for idea:", idea.substring(0, 50) + "...")
      const result = await generatePRDWithGemini(idea)
      console.log("Successfully generated PRD with Gemini")
      return NextResponse.json({ ...result, requestSucceeded: true })
    } catch (geminiError: any) {
      console.error("Error with Gemini API:", geminiError)
      
      // Check if it's a configuration error
      if (geminiError.message?.includes("GEMINI_API_KEY")) {
        return NextResponse.json(
          { 
            error: "AI service is not properly configured. Please try again later.",
            requestSucceeded: false
          }, 
          { status: 503 }
        )
      }
      
      // For other Gemini errors, try the fallback
      console.log("Using fallback PRD generator")
      const fallbackResult = generateFallbackPRD(idea)
      return NextResponse.json({ ...fallbackResult, requestSucceeded: true })
    }
  } catch (error: any) {
    // Log the full error for debugging
    console.error("Unexpected error generating PRD:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // Send a sanitized error message to the client
    return NextResponse.json({ 
      error: "An unexpected error occurred. Please try again later.",
      requestSucceeded: false
    }, { status: 500 })
  }
}

