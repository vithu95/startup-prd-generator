import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./styles/landing-page.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
// We'll import AOS CSS only on the client side component

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PRD Generator - Structure Your Startup Ideas",
  description: "Generate structured Product Requirements Documents for your startup ideas"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        {/* We'll initialize AOS in the client component instead */}
      </body>
    </html>
  )
}



import './globals.css'