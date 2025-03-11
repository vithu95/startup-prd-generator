"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { GeneratorSidebar } from "@/components/generator-sidebar"
import { GeneratorWorkspace } from "@/components/generator-workspace"
import { useAuth } from "@/context/auth-context"
import { getUserPRDs } from "@/lib/generate-prd"
import type { PRDDocument } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function GeneratorPage() {
  const [prds, setPrds] = useState<PRDDocument[]>([])
  const [selectedPrdId, setSelectedPrdId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  useEffect(() => {
    // Fetch user's PRDs when the component mounts
    const fetchPRDs = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          console.log("Fetching PRDs for user:", user.id);
          const data = await getUserPRDs(user.id);
          console.log("Fetched PRDs:", data);
          setPrds(data || []);

          // If there are PRDs, select the first one by default
          if (data && data.length > 0) {
            setSelectedPrdId(data[0].id);
          }

          // Check for pending PRD idea after login
          const pendingIdea = localStorage.getItem('pendingPrdIdea');
          if (pendingIdea) {
            // Clear the pending idea from localStorage
            localStorage.removeItem('pendingPrdIdea');
            localStorage.removeItem('pendingPrdFeelingLucky');
            
            // Open the dialog with the pending idea
            if (typeof window !== 'undefined') {
              // We need to dispatch a custom event since we can't directly access the GeneratorSidebar's state
              window.dispatchEvent(new CustomEvent('openGeneratorDialog', { detail: { idea: pendingIdea } }));
            }
          }
        } catch (error) {
          console.error("Error fetching PRDs:", error);
          setPrds([]);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No authenticated user found");
        setPrds([]);
        setLoading(false);
      }
    };

    if (!user) {
      setLoading(false);
      return;
    }

    fetchPRDs();
  }, [user]);

  // Function to handle selection of a PRD from the sidebar
  const handleSelectPrd = (id: string) => {
    setSelectedPrdId(id)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  // Function to add a newly generated PRD to the list
  const handleAddPrd = (prd: PRDDocument) => {
    setPrds(prevPrds => [prd, ...prevPrds])
    if (prd.id) {
      setSelectedPrdId(prd.id)
    }
  }

  // Function to update a PRD in the list
  const handleUpdatePrd = (updatedPrd: PRDDocument) => {
    setPrds(prds.map((prd) => (prd.id === updatedPrd.id ? updatedPrd : prd)))
  }

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-white to-gray-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-lg shadow-md bg-white"
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-center text-gray-600 font-medium">Loading your PRDs...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-white to-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ 
                width: typeof window !== 'undefined' && window.innerWidth < 768 ? "100%" : "300px", 
                opacity: 1 
              }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-r border-gray-100 shadow-sm bg-white fixed inset-y-0 left-0 z-50 md:relative"
              style={{
                top: typeof window !== 'undefined' && window.innerWidth < 768 ? "64px" : "0px" // Adjust based on your header height
              }}
            >
              <GeneratorSidebar
                prds={prds}
                selectedPrdId={selectedPrdId}
                onSelectPrd={handleSelectPrd}
                onAddPrd={handleAddPrd}
                onToggleSidebar={toggleSidebar}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          className={cn(
            "flex-1 bg-white rounded-tl-2xl shadow-inner",
            sidebarOpen && "md:ml-0 hidden md:block" // Hide on mobile when sidebar is open
          )}
          animate={{ 
            marginLeft: sidebarOpen ? "0px" : "0px" 
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <GeneratorWorkspace 
            selectedPrdId={selectedPrdId} 
            onUpdatePrd={handleUpdatePrd} 
            onToggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        </motion.div>
      </div>
    </div>
  )
}

