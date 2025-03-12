'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function LandingPage() {
  const router = useRouter();
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isFeaturesSectionInView = useInView(featuresRef, { once: false, amount: 0.2 });
  const isPricingSectionInView = useInView(pricingRef, { once: false, amount: 0.2 });
  
  // This hook helps make animations more accessible by respecting user preferences
  const prefersReducedMotion = useReducedMotion();

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
    visible: (i) => ({ 
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
    visible: (i) => ({ 
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

  return (
    <div className="landing-page">
      <header>
        <nav className="navbar">
          <div className="logo">PRD Generator</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="auth-buttons">
            <Link href="/generator" className="signup-button">Start Now</Link>
          </div>
          <button 
            className="mobile-menu-button md:hidden" 
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <a href="#features" onClick={closeMobileMenu}>Features</a>
            <a href="#pricing" onClick={closeMobileMenu}>Pricing</a>
            <Link href="/generator" onClick={closeMobileMenu} className="mobile-cta">
              Start Now
            </Link>
          </div>
        )}
      </header>
      
      {/* Hero Section with Framer Motion */}
      <section className="hero-section">
        {/* Add decorative elements */}
        <div className="hero-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-dots"></div>
        </div>
        
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="gradient-text">Transform Your Startup Ideas into Structured PRDs</h1>
          <p className="hero-subtitle">Generate comprehensive Product Requirement Documents in seconds. 
             Perfect for founders, developers, and AI coding assistants.</p>
          <motion.button 
            className="cta-button"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(74, 108, 247, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => handleSignUp()}
          >
            Create Your PRD Now
            <motion.span 
              className="button-arrow"
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
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Hero image */}
          <div className="floating-document" style={{ 
            animation: prefersReducedMotion ? 'none' : 'simpleFloat 4s ease-in-out infinite' 
          }}>
            <img 
              src="https://i.redd.it/m8u59kwz7r4b1.jpg"
              alt="PRD Document Preview"
              className="document-preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section with framer-motion */}
      <section className="features-section" id="features" ref={featuresRef}>
        <motion.h2 
          animate={isFeaturesSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Features
        </motion.h2>
        
        <motion.p 
          className="section-subtitle"
          animate={isFeaturesSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Our platform offers everything you need to transform your startup ideas into structured documents
        </motion.p>
        
        <div className="features-grid">
          {featureItems.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              custom={index}
              initial="hidden"
              animate={isFeaturesSectionInView ? "visible" : "hidden"}
              variants={featureVariants}
            >
              <div className="feature-icon">
                {/* Add appropriate icon for each feature type */}
                {feature.title.includes("AI") && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                )}
                {feature.title.includes("Export") && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <path d="M13 2v7h7" />
                  </svg>
                )}
                {/* Add other icon conditions */}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section with framer-motion */}
      <section className="pricing-section" id="pricing" ref={pricingRef}>
        <div className="pricing-bg-wrapper">
          <div className="parallax-bg"></div>
        </div>
        
        <motion.h2 
          animate={isPricingSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Pricing Plans
        </motion.h2>
        <motion.p 
          className="section-subtitle"
          animate={isPricingSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Choose the plan that fits your needs
        </motion.p>
        
        <div className="pricing-grid">
          <motion.div 
            className="pricing-card"
            custom={0}
            initial="hidden"
            animate={isPricingSectionInView ? "visible" : "hidden"}
            variants={pricingVariants}
          >
            <div className="pricing-header">
              <h3>Free</h3>
              <div className="price">$0</div>
              <p>Get started trying out the platform</p>
            </div>
            <div className="pricing-features">
              <ul>
                <li>3 PRD generations per month</li>
                <li>Basic PRD structure</li>
                <li>Markdown export</li>
                <li>Access to example library</li>
              </ul>
            </div>
            <button 
              className="pricing-button"
              onClick={() => handleSignUp('free')}
            >
              Get Started
            </button>
          </motion.div>
          
          <motion.div 
            className="pricing-card featured"
            custom={1}
            initial="hidden"
            animate={isPricingSectionInView ? "visible" : "hidden"}
            variants={pricingVariants}
          >
            <div className="pricing-header">
              <div className="popular-tag">Most Popular</div>
              <h3>Pro</h3>
              <div className="price">$19</div>
              <p>For individuals and teams</p>
            </div>
            <div className="pricing-features">
              <ul>
                <li>Unlimited PRD generations</li>
                <li>Advanced PRD customization</li>
                <li>Markdown & JSON export</li>
                <li>Save and organize PRDs</li>
                <li>Priority support</li>
              </ul>
            </div>
            <button 
              className="pricing-button highlight"
              onClick={() => handleSignUp('pro')}
            >
              Subscribe
            </button>
          </motion.div>
          
          <motion.div 
            className="pricing-card"
            custom={2}
            initial="hidden"
            animate={isPricingSectionInView ? "visible" : "hidden"}
            variants={pricingVariants}
          >
            <div className="pricing-header">
              <h3>Enterprise</h3>
              <div className="price">$49</div>
              <p>For growing teams and businesses</p>
            </div>
            <div className="pricing-features">
              <ul>
                <li>Everything in Pro</li>
                <li>Team collaboration</li>
                <li>Custom PRD templates</li>
                <li>API access</li>
                <li>Dedicated support</li>
                <li>White-labeling options</li>
              </ul>
            </div>
            <button 
              className="pricing-button"
              onClick={handleContactSales}
            >
              Contact Sales
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">PRD Generator</div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
            </div>
            {/* More footer columns */}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 PRD Generator. All rights reserved.</p>
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