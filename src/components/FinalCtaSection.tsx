import React from 'react';
import { SITE_METADATA } from '../data/content';
import { Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface FinalCtaSectionProps {
  onOpenBooking: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="final-cta" className="section-y-lg bg-[#140d27] border-t border-[#d1d0dc]/15 relative overflow-hidden text-center">
      {/* Sacred circular halo effects & cosmic orbital rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(20rem,52vmin,44rem)] aspect-square rounded-full bg-[#2433b3]/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(28rem,74vmin,62rem)] aspect-square border border-white/[0.04] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(36rem,92vmin,78rem)] aspect-square border border-[#2433b3]/10 rounded-full" />
      </div>

      <div className="shell relative z-10 flex flex-col items-center">
        {/* Sacred Emblem Icon */}
        <div className="w-[clamp(4rem,4.6vw,6rem)] aspect-square rounded-2xl bg-[#2433b3]/20 border border-[#2433b3]/40 mb-[clamp(1.75rem,2.6vw,3.25rem)] flex items-center justify-center text-[#e6e2f8] shadow-xl shadow-[#2433b3]/20">
          <Sparkles className="w-1/2 h-1/2" />
        </div>

        {/* Final CTA Heading */}
        <h2 className="font-serif-heading text-section font-bold text-[#ffffff] text-balance mb-[clamp(1.25rem,2vw,2.5rem)]">
          Cleansing Past. Awakening Future.
          <span className="block text-[#e6e2f8] mt-2 font-normal text-title-lg">
            Your Transformation Begins Within.
          </span>
        </h2>

        <p className="text-lede text-[#e6e2f8]/85 measure text-pretty tracking-[0.5px] mb-[clamp(2.25rem,3.5vw,4.5rem)]">
          Take the first step toward understanding your karmic lessons and activating your highest spiritual path through authentic 5th-generation Nadi consultation.
        </p>

        {/* Primary CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-[clamp(3rem,5vw,6.5rem)] w-full">
          <button
            type="button"
            id="final-cta-begin-journey-btn"
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-[clamp(2rem,2.6vw,3.5rem)] py-[clamp(1rem,1.3vw,1.6rem)] rounded-full font-bold text-body-lg uppercase tracking-wider text-[#ffffff] bg-[#2433b3] hover:bg-[#1b268a] transition-all duration-300 shadow-xl shadow-[#2433b3]/35 hover:shadow-2xl hover:shadow-[#2433b3]/45 hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer group border border-[#2433b3]"
          >
            <span>{SITE_METADATA.secondaryCtaText}</span>
            <ArrowRight className="w-5 h-5 shrink-0 text-[#e6e2f8] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-[clamp(1rem,2vw,3rem)] text-body-sm text-[#e6e2f8]/80 mb-[clamp(2.5rem,4vw,5rem)]">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2433b3]" />
            100% Confidential & Sacred
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#f54b37]" />
            Compassionate 1-on-1 Guidance
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2433b3]" />
            Worldwide Video Availability
          </span>
        </div>

        {/* Official Mandatory Disclaimer */}
        <div className="p-[clamp(1.25rem,1.8vw,2.25rem)] rounded-2xl bg-[#0e0b14] border border-white/10 measure-wide text-left sm:text-center">
          <p className="text-body-sm text-[#e6e2f8]/60 leading-relaxed italic text-pretty">
            {SITE_METADATA.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
};
