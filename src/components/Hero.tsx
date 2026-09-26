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
      className="relative min-h-[clamp(40rem,100svh,68rem)] pt-[calc(var(--nav-h,5rem)+clamp(2.5rem,7vh,7rem))] pb-[clamp(4.5rem,8vw,10rem)] flex flex-col justify-center items-center overflow-hidden cosmic-stars-bg"
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

      <div className="shell text-center relative z-10 flex flex-col items-center">
        <h1
          id="hero-tagline"
          className="font-serif-heading text-display font-bold text-[#ffffff] text-balance mb-[clamp(1.5rem,2.2vw,2.75rem)]"
        >
          <span className="block">Cleansing Past.</span>
          <span className="block text-[#ffffff]">Awakening Future.</span>
        </h1>

        <p
          id="hero-subtitle"
          className="text-lede text-[#e6e2f8]/85 font-normal measure text-pretty tracking-[0.5px] mb-[clamp(2.25rem,3.5vw,4rem)]"
        >
          Ancient Nadi Wisdom for Global Seekers — Guided by{' '}
          <span className="text-[#ffffff] font-semibold underline decoration-[#2433b3] decoration-2 underline-offset-4">
            Iswariya Sivasamy
          </span>
          , International Spiritual & Nadi Advisor.
        </p>

        {/* Primary Pill CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[clamp(1rem,1.4vw,1.75rem)] w-full">
          <button
            type="button"
            id="hero-primary-cta-btn"
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-[clamp(2rem,2.6vw,3.5rem)] py-[clamp(1rem,1.3vw,1.6rem)] rounded-full font-bold text-body-lg text-[#ffffff] bg-[#2433b3] hover:bg-[#1b268a] transition-all duration-300 shadow-xl shadow-[#2433b3]/35 hover:shadow-2xl hover:shadow-[#2433b3]/45 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group border border-[#2433b3]"
          >
            <span>{SITE_METADATA.primaryCtaText}</span>
            <ArrowRight className="w-5 h-5 shrink-0 text-[#e6e2f8] group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#how-it-helps"
            id="hero-explore-link"
            className="text-body-sm font-medium tracking-wide text-[#e6e2f8]/70 hover:text-[#ffffff] transition-colors py-[clamp(0.75rem,1vw,1.25rem)] px-[clamp(1.5rem,2vw,2.5rem)] border border-white/10 hover:border-white/25 rounded-full flex items-center gap-2 whitespace-nowrap"
          >
            <span>Explore The Sacred Process</span>
            <span className="text-[#e6e2f8]">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
};
