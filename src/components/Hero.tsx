import React from 'react';
import { SITE_METADATA } from '../data/content';
import { ArrowRight } from 'lucide-react';
import GenerativeArtSceneV3 from '@/components/ui/quantum-nebula';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen min-h-[100svh] w-full flex flex-col overflow-hidden cosmic-stars-bg"
      style={{ minHeight: '100svh' }}
    >
      {/* Interactive Three.js Quantum Particle Nebula */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-90">
        <GenerativeArtSceneV3 />
      </div>

      {/* Background Celestial Illumination — full-bleed, scales with the viewport */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="celestial-glow absolute inset-0 opacity-80 pointer-events-none" />

        {/* Soft orbital rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(24rem,62vmin,52rem)] aspect-square rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(32rem,88vmin,72rem)] aspect-square rounded-full border border-[#2433b3]/[0.08] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(42rem,116vmin,96rem)] aspect-square rounded-full border border-[#2433b3]/[0.05] pointer-events-none" />
      </div>

      {/* Subtle blend gradient overlay - balanced to allow edge particles to shine while maintaining typography contrast */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#140d27]/40 via-transparent to-[#140d27]/80" />

      {/* 1. Dedicated Navbar Clearance Spacer: accurately matches the fixed header height */}
      <div
        style={{ height: 'var(--nav-h, 5.5rem)' }}
        className="w-full shrink-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* 2. Main Hero Content: occupies available visible vertical space, vertically centered and balanced */}
      <div
        className="flex-1 w-full flex flex-col justify-center items-center relative z-10 my-auto"
        style={{
          paddingTop: 'clamp(24px, 4vh, 56px)',
          paddingBottom: 'clamp(32px, 5vh, 72px)',
        }}
      >
        <div className="shell text-center flex flex-col items-center">
          <h1
            id="hero-tagline"
            className="font-serif-heading text-[clamp(2.75rem,5.5vw,6rem)] font-bold text-[#ffffff] leading-[1.08] tracking-tight text-balance mb-[clamp(1.25rem,2.5vh,2.5rem)]"
          >
            <span className="block">Cleansing Past.</span>
            <span className="block text-[#ffffff]">Awakening Future.</span>
          </h1>

          <p
            id="hero-subtitle"
            className="text-[clamp(1.05rem,1.45vw,1.5rem)] text-[#e6e2f8]/90 font-normal max-w-[clamp(34rem,62vw,56rem)] text-pretty tracking-wide leading-relaxed mb-[clamp(2rem,4vh,3.5rem)]"
          >
            Ancient Nadi Wisdom for Global Seekers — Guided by{' '}
            <span className="text-[#ffffff] font-semibold underline decoration-[#2433b3] decoration-2 underline-offset-4">
              Iswariya Sivasamy
            </span>
            , International Spiritual & Nadi Advisor.
          </p>

          {/* Primary Pill CTA Button & Secondary Link */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[clamp(1rem,1.5vw,1.75rem)] w-full">
            <button
              type="button"
              id="hero-primary-cta-btn"
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-[clamp(2.25rem,3vw,3.75rem)] py-[clamp(1rem,1.4vw,1.45rem)] rounded-full font-bold text-[clamp(1rem,1.15vw,1.25rem)] text-[#ffffff] bg-[#2433b3] hover:bg-[#1b268a] transition-all duration-300 shadow-xl shadow-[#2433b3]/35 hover:shadow-2xl hover:shadow-[#2433b3]/50 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group border border-[#2433b3]"
            >
              <span>{SITE_METADATA.primaryCtaText}</span>
              <ArrowRight className="w-5 h-5 shrink-0 text-[#e6e2f8] group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#how-it-helps"
              id="hero-explore-link"
              className="w-full sm:w-auto text-[clamp(0.9rem,1vw,1.0625rem)] font-medium tracking-wide text-[#e6e2f8]/85 hover:text-[#ffffff] transition-colors py-[clamp(1rem,1.35vw,1.4rem)] px-[clamp(1.75rem,2.2vw,2.75rem)] border border-white/15 hover:border-white/30 rounded-full flex items-center justify-center gap-2 whitespace-nowrap bg-white/[0.03] hover:bg-white/[0.08]"
            >
              <span>Explore The Sacred Process</span>
              <span className="text-[#e6e2f8]">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
