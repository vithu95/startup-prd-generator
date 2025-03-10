'use client';

import { useEffect } from 'react';

export default function useScrollAnimation() {
  useEffect(() => {
    const handleScroll = () => {
      // Parallax effect for background
      const parallaxBg = document.querySelector('.parallax-bg');
      if (parallaxBg) {
        const scrollY = window.scrollY;
        parallaxBg.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
} 