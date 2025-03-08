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
      const result = await generatePRDWithGemini(idea)
      return NextResponse.json(result)
    } catch (geminiError) {
      console.error("Error with Gemini API, using fallback:", geminiError)
      // Use fallback if Gemini API fails
      const fallbackResult = generateFallbackPRD(idea)
      return NextResponse.json(fallbackResult)
    }
  } catch (error: any) {
    console.error("Error generating PRD:", error)
    return NextResponse.json({ error: error.message || "Failed to generate PRD" }, { status: 500 })
  }
}

