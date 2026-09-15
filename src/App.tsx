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
    // 1. Initialize Lenis Smooth Inertia Scroll
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Global Scroll Trigger for 3D Shader Uniforms
    const masterTrigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // Algorithmic tension transition:
        // High (1.0) -> Low (0.12)
        const currentTension = Math.max(0.12, 1.0 - Math.pow(p, 0.75) * 0.88);
        setTension(currentTension);
      }
    });

    // 3. Cinematic Screen-to-Screen Transitions

    // Screen 1: Hero Section Parallax & Compression on Exit
    gsap.to('#hero .hero-content', {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8
      },
      y: -120,
      opacity: 0.15,
      scale: 0.94,
      ease: 'none'
    });

    gsap.to('#hero .hero-image-frame', {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8
      },
      y: -80,
      scale: 0.96,
      ease: 'none'
    });

    // Screen 2: Audience Section Curtain Scrub Over Hero
    gsap.fromTo('#audience', 
      { y: 80, opacity: 0.85 },
      {
        scrollTrigger: {
          trigger: '#audience',
          start: 'top 95%',
          end: 'top 30%',
          scrub: 0.8
        },
        y: 0,
        opacity: 1,
        ease: 'power2.out'
      }
    );

    // Audience Points Stagger
    gsap.fromTo('.audience-point-item',
      { opacity: 0, x: -35 },
      {
        scrollTrigger: {
          trigger: '#audience',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      }
    );

    // Screen 3: Value Section - Meaningful photographic parallax inside frame
    gsap.fromTo('#value .value-image',
      { yPercent: -8 },
      {
        scrollTrigger: {
          trigger: '#value',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.0
        },
        yPercent: 8,
        ease: 'none'
      }
    );

    gsap.fromTo('#value .value-content > *',
      { opacity: 0, y: 32 },
      {
        scrollTrigger: {
          trigger: '#value',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out'
      }
    );

    // Screen 4: Outcomes Section
    gsap.fromTo('.outcomes-card',
      { opacity: 0, y: 60, scale: 0.96 },
      {
        scrollTrigger: {
          trigger: '#outcomes',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'back.out(1.2)'
      }
    );

    // Screen 5: Program Section (Numbered Accordion Items Cascade)
    gsap.fromTo('.accordion-item',
      { opacity: 0, y: 25 },
      {
        scrollTrigger: {
          trigger: '#program',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );

    // Screen 6: Format Section (3D Perspective Card Tilt Entrance)
    gsap.fromTo('.format-card',
      { opacity: 0, y: 80, rotateX: 8, transformPerspective: 1200 },
      {
        scrollTrigger: {
          trigger: '#format',
          start: 'top 85%',
          end: 'top 45%',
          scrub: 0.8
        },
        opacity: 1,
        y: 0,
        rotateX: 0,
        ease: 'power2.out'
      }
    );

    // Screen 7: Reviews Cards Stagger
    gsap.fromTo('.review-card',
      { opacity: 0, y: 35 },
      {
        scrollTrigger: {
          trigger: '#reviews',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.18,
        ease: 'power2.out'
      }
    );

    // Screen 8: Author Section (Portrait Parallax & Signature Reveal)
    gsap.fromTo('#author .author-image-frame',
      { opacity: 0, scale: 0.92, y: 40 },
      {
        scrollTrigger: {
          trigger: '#author',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out'
      }
    );

    gsap.fromTo('.author-handwritten-quote',
      { opacity: 0, scale: 0.85, rotate: -8 },
      {
        scrollTrigger: {
          trigger: '#author',
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        scale: 1,
        rotate: -3,
        duration: 1.1,
        ease: 'elastic.out(1, 0.75)'
      }
    );

    // Screen 9: Pricing Section & 3D Materials Mockup
    gsap.fromTo('.materials-3d-canvas',
      { opacity: 0, rotateY: -35, scale: 0.85 },
      {
        scrollTrigger: {
          trigger: '#pricing',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        rotateY: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out'
      }
    );

    // Screen 10: Final CTA Pulse & Entrance
    gsap.fromTo('.final-cta-card',
      { opacity: 0, y: 70, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: '#final-cta',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: 'power3.out'
      }
    );

    return () => {
      masterTrigger.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      lenis.destroy();
    };
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -30, duration: 1.5 });
    }
  };

  return (
    <div className="app-root">
      {/* Dynamic 3D WebGL Background Canvas */}
      <CanvasStage scrollProgress={scrollProgress} tension={tension} />

      {/* Main Page Content Flow with Screen-to-Screen Choreography */}
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
