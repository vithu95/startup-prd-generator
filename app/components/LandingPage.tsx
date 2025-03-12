'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { useTheme } from "next-themes"
import { Moon, Sun, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

// Add this before the component
const faqItems = [
  {
    question: "What is a PRD Generator?",
    answer: "A PRD Generator is a tool that helps you create professional Product Requirement Documents quickly and efficiently. It uses AI to transform your ideas into well-structured documents that outline product features, requirements, and specifications."
  },
  {
    question: "How does the AI-powered generation work?",
    answer: "Our AI analyzes your input and automatically structures it into a comprehensive PRD. It follows industry best practices and can understand context to generate relevant sections, requirements, and specifications for your product."
  },
  {
    question: "Can I export my PRDs?",
    answer: "Yes! You can export your PRDs in multiple formats including Markdown and JSON. The Pro and Enterprise plans offer additional export options and integration capabilities."
  },
  {
    question: "Is my data secure?",
    answer: "We take data security seriously. All your PRDs and information are encrypted and stored securely. We never share your data with third parties."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! Our Free plan allows you to generate up to 3 PRDs per month at no cost. You can upgrade to any paid plan at any time to unlock additional features and higher limits."
  },
  {
    question: "Can I customize the PRD templates?",
    answer: "Absolutely! Pro and Enterprise users can create and save custom templates. You can define your own sections, formatting rules, and default content to match your team's workflow."
  },
  {
    question: "How many team members can collaborate on a PRD?",
    answer: "The Enterprise plan includes team collaboration features allowing unlimited members. Pro plan users can invite up to 3 collaborators. All plans include real-time editing and version history."
  },
  {
    question: "What integrations do you support?",
    answer: "We integrate with popular tools like Jira, Notion, and Slack. Our API (available in Enterprise plan) allows custom integrations with any platform. Exported Markdown/JSON files can be used with any documentation system."
  },
  {
    question: "Do you offer technical support?",
    answer: "We provide email support for all users with response within 24 hours. Pro users get priority support with 8-hour response time. Enterprise includes dedicated Slack support and a customer success manager."
  }
];

export default function LandingPage() {
  const router = useRouter();
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isFeaturesSectionInView = useInView(featuresRef, { once: false, amount: 0.2 });
  const isPricingSectionInView = useInView(pricingRef, { once: false, amount: 0.2 });
  
  // This hook helps make animations more accessible by respecting user preferences
  const prefersReducedMotion = useReducedMotion();

  const { theme, setTheme } = useTheme()

  useScrollAnimation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Simplified animations for better performance
  const featureVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: prefersReducedMotion ? 0 : 0.1 * i,
        duration: 0.4
      } 
    })
  };

  const pricingVariants = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 },
    visible: (i: number) => ({ 
      opacity: 1, 
      scale: 1, 
      transition: { 
        delay: prefersReducedMotion ? 0 : 0.1 * i,
        duration: 0.4
      } 
    })
  };

  const handleSignUp = (plan = '') => {
    router.push('/generator');
  };
  
  const handleContactSales = () => {
    router.push('/generator');
  };

  // Add this state for FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="landing-page pt-16 bg-white dark:bg-gray-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">PRD Generator</div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mr-2"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link href="/generator" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
              Start Now
            </Link>
          </div>
          <button 
            className="md:hidden p-2" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu with Tailwind */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 py-4 px-4 shadow-lg border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-3">
              <a href="#features" onClick={closeMobileMenu} className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary">Features</a>
              <a href="#pricing" onClick={closeMobileMenu} className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary">Pricing</a>
              <Link href="/generator" onClick={closeMobileMenu} className="py-2 px-4 mt-2 bg-primary text-white rounded-lg text-center">
              Start Now
            </Link>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero Section with Tailwind */}
      <section className="py-16 lg:py-24 px-4 relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        {/* Decorative elements with Tailwind */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        </div>
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Transform Your Startup Ideas into Structured PRDs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Generate comprehensive Product Requirement Documents in seconds. Perfect for founders, developers, and AI coding assistants.
          </p>
          <motion.button 
            className="px-8 py-3 text-lg font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => handleSignUp()}
          >
            Create Your PRD Now
            <motion.span 
              className="ml-2 inline-block"
              initial={{ x: 0 }}
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "loop", 
                duration: 1,
                repeatDelay: 1
              }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section with Tailwind */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950" id="features" ref={featuresRef}>
        <motion.h2 
          className="text-3xl font-bold text-center mb-4"
          animate={isFeaturesSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Features
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-12"
          animate={isFeaturesSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Our platform offers everything you need to transform your startup ideas into structured documents
        </motion.p>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureItems.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              custom={index}
              initial="hidden"
              animate={isFeaturesSectionInView ? "visible" : "hidden"}
              variants={featureVariants}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/80 to-blue-600/80 flex items-center justify-center mb-6 mx-auto shadow-md">
                {/* The SVG icons remain the same, but with text-white class added */}
                {feature.title.includes("AI") && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                )}
                {feature.title.includes("Export") && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <path d="M13 2v7h7" />
                  </svg>
                )}
                {/* Add appropriate icons for other features */}
                {feature.title.includes("Refinement") && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M18 2l4 4-4 4" />
                    <path d="M14 6H3" />
                    <path d="M6 14l-4 4 4 4" />
                    <path d="M10 18h11" />
                  </svg>
                )}
                {feature.title.includes("Example") && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h10" />
                    <path d="M7 12h10" />
                    <path d="M7 17h10" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-semibold text-center mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section with Tailwind styling */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900" id="pricing" ref={pricingRef}>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 dark:opacity-5">
            {/* Background pattern */}
          </div>
        </div>
        
        <motion.h2 
          className="text-3xl font-bold text-center mb-4"
          animate={isPricingSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Pricing Plans
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-12"
          animate={isPricingSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Choose the plan that fits your needs
        </motion.p>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            custom={0}
            initial="hidden"
            animate={isPricingSectionInView ? "visible" : "hidden"}
            variants={pricingVariants}
          >
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-2">$0</div>
              <p className="text-gray-600 dark:text-gray-400">Get started trying out the platform</p>
            </div>
            <div className="p-8">
              <ul className="space-y-4">
                {['3 PRD generations per month', 'Basic PRD structure', 'Markdown export', 'Access to example library'].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-8 pb-8">
            <button 
                className="w-full py-3 px-6 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors font-medium"
              onClick={() => handleSignUp('free')}
            >
              Get Started
            </button>
            </div>
          </motion.div>
          
          {/* Pro Plan (Featured) */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl relative border border-primary/30 dark:border-primary/20 transform md:-translate-y-4"
            custom={1}
            initial="hidden"
            animate={isPricingSectionInView ? "visible" : "hidden"}
            variants={pricingVariants}
          >
            <div className="absolute top-0 right-0 bg-primary text-white text-sm font-medium py-1 px-4 rounded-bl-lg rounded-tr-lg">
              Most Popular
            </div>
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-2">$19</div>
              <p className="text-gray-600 dark:text-gray-400">For individuals and teams</p>
            </div>
            <div className="p-8">
              <ul className="space-y-4">
                {['Unlimited PRD generations', 'Advanced PRD customization', 'Markdown & JSON export', 'Save and organize PRDs', 'Priority support'].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-8 pb-8">
            <button 
                className="w-full py-3 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors font-medium"
              onClick={() => handleSignUp('pro')}
            >
              Subscribe
            </button>
            </div>
          </motion.div>
          
          {/* Enterprise Plan */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            custom={2}
            initial="hidden"
            animate={isPricingSectionInView ? "visible" : "hidden"}
            variants={pricingVariants}
          >
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-2">$49</div>
              <p className="text-gray-600 dark:text-gray-400">For growing teams and businesses</p>
            </div>
            <div className="p-8">
              <ul className="space-y-4">
                {['Everything in Pro', 'Team collaboration', 'Custom PRD templates', 'API access', 'Dedicated support', 'White-labeling options'].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-8 pb-8">
            <button 
                className="w-full py-3 px-6 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors font-medium"
              onClick={handleContactSales}
            >
              Contact Sales
            </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section with improved dark mode */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950" id="faq">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-12">
            Find answers to common questions about our platform
          </p>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900 dark:text-white">{item.question}</span>
                  {openFaqIndex === index ? (
                    <Minus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer with dark/light mode support */}
      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">PRD Generator</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transform your ideas into structured Product Requirement Documents with ease.</p>
            </div>
            
            <div>
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} PRD Generator. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature items data
const featureItems = [
  {
    title: "AI-Powered PRD Generation",
    description: "Transform simple ideas into comprehensive Product Requirement Documents."
  },
  {
    title: "Multiple Export Formats",
    description: "Download your PRDs in Markdown or JSON format for easy integration with your tools."
  },
  {
    title: "Idea Refinement",
    description: "Refine and regenerate your PRDs with additional details and customizations."
  },
  {
    title: "Example Library",
    description: "Browse through pre-generated startup PRDs for inspiration and guidance."
  },
]; 