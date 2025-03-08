import { supabase, type PRDDocument } from "./supabase"

export async function generatePRD(idea: string) {
  try {
    console.log("Sending request to generate content:", idea.substring(0, 50) + "...");
    
    const response = await fetch("/api/generate-prd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API response not OK:", errorData);
      throw new Error(errorData.error || "Failed to generate PRD");
    }

    const result = await response.json();
    
    // Check if this is a section-specific update (we look for certain phrases in the prompt)
    const isSectionUpdate = idea.includes("improve the") && idea.includes("section");
    
    if (isSectionUpdate) {
      console.log("Processing section-specific update");
      
      try {
        // For section updates, we need to handle responses in different formats
        // Some responses may have the full JSON structure, others might just return the section content
        
        // Try to extract specific section content
        const json = result.json;
        
        // Look for section direct in response - AI might return the section directly
        // Example: Gemini might return { "idea_summary": "content" } instead of { "overview": { "idea_summary": "content" } }
        // If the response doesn't have the expected nested structure, we need to check if it's the direct section content
        
        // Identify which section is being updated from the prompt
        const sectionNameMatch = idea.match(/improve the ["']([^"']+)["'] section/i) || 
                               idea.match(/["']([^"']+)["'] section/i);
        
        if (sectionNameMatch) {
          const sectionName = sectionNameMatch[1].toLowerCase();
          console.log("Identified section being updated:", sectionName);
          
          // If we have a direct section content response (not wrapped in the section name)
          // For example, the response has "idea_summary" directly instead of nested under "overview"
          if (
            !json[sectionName] && 
            // For overview section, check for these fields
            ((sectionName === "overview" && (json.idea_summary || json.problem_statement || json.solution || json.target_audience)) ||
            // For features section
            (sectionName === "features" && (json.core_features || json.user_roles || json.monetization_model)) ||
            // For tech_stack section
            (sectionName === "tech_stack" && (json.frontend || json.backend || json.database)) ||
            // ...and so on for other sections
            (sectionName === "ai_integration" && (json.model || json.features)) ||
            (sectionName === "ui_ux_design" && (json.style || json.key_elements)) ||
            (sectionName === "deployment" && (json.hosting || json.scalability)) ||
            (sectionName === "roadmap" && (json.mvp || json.launch)))
          ) {
            console.log("AI returned direct section content, restructuring...");
            // Restructure the response to have the proper nesting
            const restructuredJson = {};
            restructuredJson[sectionName] = json;
            result.json = restructuredJson;
            console.log("Restructured JSON:", result.json);
          }
        }
      } catch (error) {
        console.error("Error processing section response:", error);
        // Continue with the original result if there's an error in our processing
      }
      
      // Remove any description field that might have been generated
      if (result.description !== undefined) {
        console.log("Removing generated description from section update");
        delete result.description;
      }
    }

    return result;
  } catch (error) {
    console.error("Error in generatePRD:", error);
    throw error;
  }
}

export async function savePRD(prd: PRDDocument) {
  try {
    let result;
    
    // If the PRD has an ID, it's an update operation
    if (prd.id) {
      console.log("Updating existing PRD:", prd.id);
      
      // For updates, first fetch the existing PRD to preserve metadata
      const { data: existingPRD, error: fetchError } = await supabase
        .from("prds")
        .select("*")
        .eq("id", prd.id)
        .single();
        
      if (fetchError) {
        console.error("Error fetching existing PRD for update:", fetchError);
        throw fetchError;
      }
      
      if (!existingPRD) {
        throw new Error(`PRD with ID ${prd.id} not found`);
      }
      
      // EXTREMELY IMPORTANT: Always preserve the original description
      console.log("Original description:", existingPRD.description);
      console.log("New description before preservation:", prd.description);
      
      // Create update payload with preserved metadata
      const updatePayload = {
        title: prd.title || existingPRD.title,
        description: existingPRD.description, // ALWAYS use the existing description
        markdown: prd.markdown,
        json_data: prd.json_data
      };
      
      console.log("Update payload prepared with preserved description");
      
      const { data, error } = await supabase
        .from("prds")
        .update(updatePayload)
        .eq("id", prd.id)
        .select();
      
      if (error) {
        console.error("Error updating PRD:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error("No data returned after update");
      }
      
      result = {
        ...data[0],
        description: existingPRD.description // Double-ensure the description is preserved
      };
      
      console.log("PRD updated successfully with preserved description");
    } 
    // Otherwise, it's a new PRD to insert
    else {
      console.log("Inserting new PRD");
      const { data, error } = await supabase
        .from("prds")
        .insert(prd)
        .select();
      
      if (error) {
        console.error("Error inserting PRD:", error);
        throw error;
      }
      result = data[0];
    }

    return result;
  } catch (error) {
    console.error("Error saving PRD:", error);
    throw error;
  }
}

export async function getUserPRDs(userId: string) {
  if (!userId) {
    console.error("getUserPRDs called with no userId");
    return [];
  }

  try {
    console.log("Querying supabase for PRDs with user_id:", userId);
    const { data, error } = await supabase
      .from("prds")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error getting user PRDs:", error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} PRDs for user ${userId}`);
    return data || [];
  } catch (error) {
    console.error("Error getting user PRDs:", error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
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

