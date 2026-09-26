import React from 'react';
import { PILLARS_DATA } from '../data/content';
import { Sparkles, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

interface PillarsSectionProps {
  onOpenBooking: () => void;
}

export const PillarsSection: React.FC<PillarsSectionProps> = ({ onOpenBooking }) => {
  const { cleansing, awakening } = PILLARS_DATA;

  return (
    <section id="how-it-helps" className="section-y bg-[#f9f9fa] text-[#140d27] relative overflow-hidden">
      <div className="shell relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-[clamp(3.5rem,6vw,7rem)]">
          <h2 className="font-serif-heading text-section font-bold text-[#140d27] capitalize text-balance mb-[clamp(1rem,1.4vw,1.75rem)]">
            What It Means / How Nadi Sudhi Helps
          </h2>
          <p className="text-lede text-[#363746] font-normal measure text-pretty tracking-[0.5px]">
            {PILLARS_DATA.subtitle}
          </p>
        </div>

        {/* Two Pillars Grid (Cleansing Past & Awakening Future) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.75rem,3vw,4.5rem)] mb-[clamp(3rem,4.5vw,6rem)]">
          {/* Pillar 1: CLEANSING PAST */}
          <div
            id="pillar-cleansing-past"
            className="rounded-3xl p-[clamp(1.75rem,2.8vw,4rem)] bg-[#ffffff] border border-[#d1d0dc] hover:border-[#2433b3] transition-all duration-300 relative group flex flex-col justify-between shadow-sm hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-1.5 rounded-full text-eyebrow font-bold uppercasebg-[#e6e2f8] text-[#2433b3]">
                  {cleansing.badge}
                </span>
                <div className="w-[clamp(2.75rem,3vw,3.75rem)] aspect-square shrink-0 rounded-fullbg-[#e6e2f8] flex items-center justify-center text-[#2433b3]">
                  <Compass className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-serif-heading text-title-lg font-bold text-[#140d27] tracking-[0.5px] text-balance mb-3">
                {cleansing.title}
              </h3>

              <h4 className="text-body-lg font-semibold text-[#2433b3] measure mb-4 leading-snug text-pretty">
                {cleansing.subtitle}
              </h4>

              <p className="text-body text-[#535353] measure leading-relaxed text-pretty mb-8">
                {cleansing.description}
              </p>

              <div className="space-y-3.5 pt-6 border-t border-[#d1d0dc]/60 mb-8">
                {cleansing.highlights.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2433b3] shrink-0 mt-0.5" />
                    <span className="text-body-sm text-[#363746] font-medium leading-relaxed text-pretty">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#d1d0dc]/60 flex items-center justify-between gap-4 text-body-sm text-[#535353]">
              <span className="font-medium">Resolves recurring karmic knots (Nadi Mudichu)</span>
              <span className="text-[#2433b3] font-bold group-hover:translate-x-1 transition-transform">
                Root Release →
              </span>
            </div>
          </div>

          {/* Pillar 2: AWAKENING FUTURE */}
          <div
            id="pillar-awakening-future"
            className="rounded-3xl p-[clamp(1.75rem,2.8vw,4rem)] bg-[#ffffff] border border-[#d1d0dc] hover:border-[#2433b3] transition-all duration-300 relative group flex flex-col justify-between shadow-sm hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-1.5 rounded-full text-eyebrow font-bold uppercasebg-[#140d27] text-[#ffffff]">
                  {awakening.badge}
                </span>
                <div className="w-[clamp(2.75rem,3vw,3.75rem)] aspect-square shrink-0 rounded-fullbg-[#140d27] flex items-center justify-center text-[#e6e2f8]">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-serif-heading text-title-lg font-bold text-[#140d27] tracking-[0.5px] text-balance mb-3">
                {awakening.title}
              </h3>

              <h4 className="text-body-lg font-semibold text-[#2433b3] measure mb-4 leading-snug text-pretty">
                {awakening.subtitle}
              </h4>

              <p className="text-body text-[#535353] measure leading-relaxed text-pretty mb-8">
                {awakening.description}
              </p>

              <div className="space-y-3.5 pt-6 border-t border-[#d1d0dc]/60 mb-8">
                {awakening.highlights.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2433b3] shrink-0 mt-0.5" />
                    <span className="text-body-sm text-[#363746] font-medium leading-relaxed text-pretty">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#d1d0dc]/60 flex items-center justify-between gap-4 text-body-sm text-[#535353]">
              <span className="font-medium">Awakens conscious alignment & clear decisions</span>
              <span className="text-[#2433b3] font-bold group-hover:translate-x-1 transition-transform">
                Soul Clarity →
              </span>
            </div>
          </div>
        </div>

        {/* Action Callout within Light Section */}
        <div className="p-[clamp(1.75rem,2.6vw,3.5rem)] rounded-3xl bg-[#e6e2f8]/50 border border-[#d1d0dc] flex flex-col sm:flex-row items-center justify-between gap-[clamp(1.5rem,2.5vw,4rem)] text-center sm:text-left">
          <div className="measure-wide">
            <h4 className="font-serif-heading text-title font-bold text-[#140d27] text-balance">
              Ready to release karmic blocks and clarify your future?
            </h4>
            <p className="text-body-sm text-[#535353] mt-1.5 text-pretty">
              Connect directly with 5th-generation lineage wisdom over a private 1-on-1 session.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBooking}
            className="shrink-0 px-[clamp(1.75rem,2.2vw,3rem)] py-[clamp(0.875rem,1.1vw,1.375rem)] rounded-full font-bold text-eyebrow uppercase text-[#ffffff] bg-[#2433b3] hover:bg-[#1b268a] transition-all flex items-center gap-2.5 cursor-pointer shadow-md shadow-[#2433b3]/25 whitespace-nowrap"
          >
            <span>Book Session</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
};
