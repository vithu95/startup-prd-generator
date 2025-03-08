import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <div className="container mx-auto text-center py-8">
        <Link href="/generator">
          <Button size="lg" className="text-lg px-8">
            Go to PRD Generator
          </Button>
        </Link>
      </div>
      <Features />
      <PricingSection />
      <Footer />
    </main>
  )
}

