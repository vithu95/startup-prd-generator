"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out successfully",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error signing out",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            PRD Generator
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Add dark mode toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* User menu/profile button */}
          {/*<UserMenu />*/}
        </div>
      </div>
    </header>
  )
}

