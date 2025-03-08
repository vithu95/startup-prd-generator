"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

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
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          PRD Generator
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-gray-600 hover:text-primary">
            Features
          </Link>
          <Link href="/#pricing" className="text-gray-600 hover:text-primary">
            Pricing
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-primary">
                Dashboard
              </Link>
              <Button variant="outline" onClick={handleSignOut} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => router.push("/auth/sign-in")} className="ml-2">
                Sign In
              </Button>
              <Button onClick={() => router.push("/auth/sign-up")}>Get Started</Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/#features"
              className="text-gray-600 hover:text-primary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-gray-600 hover:text-primary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-primary py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button variant="outline" onClick={handleSignOut} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/auth/sign-in")
                    setIsMenuOpen(false)
                  }}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    router.push("/auth/sign-up")
                    setIsMenuOpen(false)
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

