import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
          Transform Your Startup Ideas into Structured PRDs
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Generate comprehensive Product Requirements Documents in seconds. Perfect for founders, developers, and AI
          coding assistants.
        </p>
        <div className="flex justify-center">
          <Link href="/generator">
            <Button size="lg" className="text-lg px-8 font-semibold">
              Create Your PRD Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

