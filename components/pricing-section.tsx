import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out the platform",
      features: ["3 PRD generations per month", "Basic PRD structure", "Markdown export", "Access to example library"],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For founders and small teams",
      features: [
        "Unlimited PRD generations",
        "Advanced PRD customization",
        "Markdown & JSON export",
        "Save and organize PRDs",
        "Priority support",
      ],
      buttonText: "Subscribe",
      buttonVariant: "default" as const,
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "/month",
      description: "For growing startups and businesses",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Custom PRD templates",
        "API access",
        "Dedicated support",
        "White-labeling options",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ]

  return (
    <section id="pricing" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Pricing Plans</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Choose the plan that fits your needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`border-gray-200 ${plan.highlighted ? "ring-2 ring-primary shadow-lg" : ""}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.buttonVariant} className="w-full">
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

