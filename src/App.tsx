import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CanvasStage } from './components/3d/CanvasStage';
import { HeroSection } from './components/sections/HeroSection';
import { AudienceSection } from './components/sections/AudienceSection';
import { ValueSection } from './components/sections/ValueSection';
import { OutcomesSection } from './components/sections/OutcomesSection';
import { ProgramSection } from './components/sections/ProgramSection';
import { FormatSection } from './components/sections/FormatSection';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { AuthorSection } from './components/sections/AuthorSection';
import { PricingSection } from './components/sections/PricingSection';
import { FaqSection } from './components/sections/FaqSection';
import { FinalCtaSection } from './components/sections/FinalCtaSection';

import './styles/global.css';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tension, setTension] = useState(1.0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9
    });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Global ScrollTrigger for 3D Shader Uniforms
    const masterTrigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // Algorithmic emotional tension:
        // Starts high (1.0) at Hero & Audience, drops gently to 0.15 by Program & Author
        const calculatedTension = Math.max(0.12, 1.0 - p * 0.9);
        setTension(calculatedTension);
      }
    });

    // 3. Section Reveal Animations with ScrollTrigger
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      gsap.fromTo(
        section.querySelectorAll('.container > *'),
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => {
      masterTrigger.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      lenis.destroy();
    };
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -20, duration: 1.4 });
    }
  };

  return (
    <div className="app-root">
      {/* Dynamic 3D WebGL Background Canvas */}
      <CanvasStage scrollProgress={scrollProgress} tension={tension} />

      {/* Main Page Content Flow */}
      <main className="content-wrapper">
        <HeroSection onCtaClick={() => scrollToId('audience')} />
        <AudienceSection />
        <ValueSection onProgramClick={() => scrollToId('program')} />
        <OutcomesSection />
        <ProgramSection />
        <FormatSection onPreviewClick={() => scrollToId('pricing')} />
        <ReviewsSection />
        <AuthorSection />
        <PricingSection onBuyClick={() => scrollToId('final-cta')} />
        <FaqSection />
        <FinalCtaSection onDirectClick={() => window.open('https://instagram.com', '_blank')} />
      </main>
    </div>
  );
};

export default App;
