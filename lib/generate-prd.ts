import { supabase, type PRDDocument } from "./supabase"

export async function generatePRD(idea: string) {
  try {
    const response = await fetch("/api/generate-prd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate PRD")
    }

    return await response.json()
  } catch (error) {
    console.error("Error in generatePRD:", error)
    throw error
  }
}

export async function savePRD(prd: PRDDocument) {
  try {
    const { data, error } = await supabase.from("prds").insert(prd).select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error("Error saving PRD:", error)
    throw error
  }
}

export async function getUserPRDs(userId: string) {
  try {
    const { data, error } = await supabase
      .from("prds")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting user PRDs:", error)
    throw error
  }
}

export async function getPRDById(id: string) {
  try {
    const { data, error } = await supabase.from("prds").select("*").eq("id", id).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting PRD by ID:", error)
    throw error
  }
}

export async function deletePRD(id: string) {
  try {
    const { error } = await supabase.from("prds").delete().eq("id", id)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting PRD:", error)
    throw error
  }
}

