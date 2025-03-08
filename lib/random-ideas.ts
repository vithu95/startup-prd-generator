const startupIdeas = [
  "A platform that uses AI to help small businesses optimize their social media marketing strategies",
  "A subscription service that delivers personalized plant care kits based on your specific houseplants",
  "An app that connects local farmers directly with restaurants to reduce food waste and support local agriculture",
  "A virtual reality platform for remote team building activities and corporate retreats",
  "A marketplace for renting specialized tools and equipment from neighbors in your community",
  "A service that uses machine learning to analyze and improve email communication patterns in teams",
  "A platform that helps parents find and book vetted after-school activities for their children",
  "An AI-powered personal shopping assistant that learns your style and budget preferences",
  "A subscription box service that delivers international snacks paired with language learning materials",
  "A platform that connects elderly individuals with tech-savvy helpers for on-demand tech support",
  "A service that helps remote workers find and book temporary workspaces in residential neighborhoods",
  "An app that gamifies household chores and responsibilities for families",
  "A platform that helps indie game developers find and collaborate with voice actors and musicians",
  "A service that uses drones to deliver emergency medical supplies in rural areas",
  "A marketplace for booking unique outdoor experiences led by local experts",
  "An AI writing assistant specialized for academic research papers",
  "A platform that helps people find and join local volunteer opportunities based on their skills",
  "A service that converts food waste from restaurants into compost for urban gardens",
  "An app that helps people track and reduce their carbon footprint through personalized suggestions",
  "A platform that connects homeowners with architects for quick virtual consultations",
  "A service that helps small businesses implement and manage sustainable practices",
  "An app that provides guided audio tours of street art and murals in cities worldwide",
  "A platform that helps musicians find last-minute substitutes for gigs and performances",
  "A service that delivers customized meal kits based on your health data and fitness goals",
  "An AI-powered platform that helps non-designers create professional marketing materials",
  "A marketplace for booking unused restaurant kitchen space for food entrepreneurs",
  "A service that helps international students navigate housing, banking, and healthcare in new countries",
  "An app that connects people with similar hobbies for in-person meetups and activities",
  "A platform that helps small businesses offer and manage digital gift cards",
  "A service that provides on-demand childcare for parents who work non-traditional hours",
]

export function getRandomStartupIdea(): string {
  const randomIndex = Math.floor(Math.random() * startupIdeas.length)
  return startupIdeas[randomIndex]
}

