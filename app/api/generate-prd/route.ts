import { type NextRequest, NextResponse } from "next/server"
import { generatePRDWithGemini } from "@/lib/gemini"
import { generateFallbackPRD } from "@/lib/fallback-prd"

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json()

    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Invalid request. Please provide a valid idea." }, { status: 400 })
    }

    try {
      console.log("Attempting to generate PRD with Gemini for idea:", idea.substring(0, 50) + "...")
      const result = await generatePRDWithGemini(idea)
      console.log("Successfully generated PRD with Gemini")
      return NextResponse.json(result)
    } catch (geminiError: any) {
      console.error("Error with Gemini API, details:", geminiError.message)
      console.log("Using fallback PRD generator instead")
      
      // Use fallback if Gemini API fails
      const fallbackResult = generateFallbackPRD(idea)
      return NextResponse.json(fallbackResult)
    }
  } catch (error: any) {
    // Create a sanitized error message for the client
    const clientErrorMessage = error.message?.includes("API") 
      ? "Error connecting to AI service. Please try again later." 
      : "Failed to generate PRD. Please try again with a different idea."
    
    console.error("Error generating PRD:", {
      message: error.message || "Unknown error",
      stack: error.stack,
    })
    
    return NextResponse.json({ 
      error: clientErrorMessage,
      requestSucceeded: false
    }, { status: 500 })
  }
}

