import React from 'react';
import { ADVISOR_DATA } from '../data/content';
import { Award, Compass, Globe, ArrowRight } from 'lucide-react';
import { US, GB, CA, AE, AU, SG, IN } from 'country-flag-icons/react/3x2';

interface AdvisorSectionProps {
  onOpenBooking: () => void;
}

const COUNTRY_FLAG_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  USA: US,
  UK: GB,
  Canada: CA,
  UAE: AE,
  Australia: AU,
  Singapore: SG,
  India: IN,
};

export const AdvisorSection: React.FC<AdvisorSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="advisor" className="section-y bg-[#140d27] border-t border-[#d1d0dc]/15 relative">
      <div className="shell">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-[clamp(3.5rem,6vw,7rem)]">
          <h2 className="font-serif-heading text-section font-bold text-[#ffffff] capitalize text-balance mb-[clamp(1rem,1.4vw,1.75rem)]">
            Meet Your Advisor — {ADVISOR_DATA.name}
          </h2>
          <p className="text-lede text-[#e6e2f8]/80 font-normal measure text-pretty tracking-[0.5px]">
            {ADVISOR_DATA.role}
          </p>
        </div>

        {/* Main Advisor Feature Card */}
        <div className="rounded-3xl bg-[#1b1335]/70 border border-[#d1d0dc]/20 p-[clamp(1.75rem,3.2vw,4.5rem)] shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* Subtle celestial illumination */}
          <div className="absolute -top-24 -right-24 w-[clamp(20rem,26vw,34rem)] aspect-square rounded-full bg-[#2433b3]/15 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(2.5rem,4vw,6rem)] items-center">
            {/* Left Col: Sacred Lineage Badge Frame */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-[clamp(20rem,28vw,36rem)] aspect-square rounded-full p-2 bg-gradient-to-tr from-[#2433b3] via-[#e6e2f8] to-[#140d27] shadow-2xl shadow-black/80 mb-6 flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#1c1433]">
                  <img
                    src="https://res.cloudinary.com/knte21xa/image/upload/v1789554757/IMG-20260112-WA0025.jpg"
                    alt={ADVISOR_DATA.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

            </div>

            {/* Right Col: Accomplishments & Lineage Credibility */}
            <div className="lg:col-span-7 space-y-[clamp(1.25rem,1.8vw,2.25rem)] text-left">
              <div>
                <h3 className="font-serif-heading text-title-lg font-bold text-[#ffffff] measure-wide text-balance mb-1.5">
                  Bridging Ancient Nadi Sastra with Modern Spiritual Coaching
                </h3>
                <p className="text-eyebrow uppercase text-[#e6e2f8]/80 font-bold">
                  {ADVISOR_DATA.lineage}
                </p>
              </div>

              <div className="space-y-[clamp(0.875rem,1.2vw,1.5rem)]">
                {/* Point 1: 5th-Gen Practitioner */}
                <div className="p-[clamp(1.125rem,1.5vw,2rem)] rounded-2xl bg-[#0e0b14]/70 border border-white/5 flex items-start gap-[clamp(0.875rem,1.2vw,1.5rem)]">
                  <div className="p-2.5 rounded-xl bg-[#2433b3]/20 border border-[#2433b3]/40 text-[#e6e2f8] shrink-0 mt-0.5">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-body-lg font-bold text-[#ffffff] text-balance">
                      5th-Generation Practitioner
                    </h4>
                    <p className="text-body-sm text-[#e6e2f8]/75 mt-1.5 leading-relaxed measure text-pretty">
                      Carrying forward a sacred lineage originating directly from Vaitheeswaran Koil, Tamil Nadu — the revered epicentre of authentic Palm-Leaf Nadi Astrology.
                    </p>
                  </div>
                </div>

                {/* Point 2: Pioneering Lineage Leadership */}
                <div className="p-[clamp(1.125rem,1.5vw,2rem)] rounded-2xl bg-[#0e0b14]/70 border border-white/5 flex items-start gap-[clamp(0.875rem,1.2vw,1.5rem)]">
                  <div className="p-2.5 rounded-xl bg-[#2433b3]/20 border border-[#2433b3]/40 text-[#e6e2f8] shrink-0 mt-0.5">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-body-lg font-bold text-[#ffffff] text-balance">
                      Pioneering Lineage Leadership
                    </h4>
                    <p className="text-body-sm text-[#e6e2f8]/75 mt-1.5 leading-relaxed measure text-pretty">
                      {ADVISOR_DATA.pioneeringAchievement}
                    </p>
                  </div>
                </div>

                {/* Point 3: Global Reach */}
                <div className="p-[clamp(1.125rem,1.5vw,2rem)] rounded-2xl bg-[#0e0b14]/70 border border-white/5 flex items-start gap-[clamp(0.875rem,1.2vw,1.5rem)]">
                  <div className="p-2.5 rounded-xl bg-[#2433b3]/20 border border-[#2433b3]/40 text-[#e6e2f8] shrink-0 mt-0.5">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body-lg font-bold text-[#ffffff] text-balance">
                      Global Reach & Consultations
                    </h4>
                    <p className="text-body-sm text-[#e6e2f8]/75 mt-1.5 leading-relaxed measure text-pretty">
                      Dedicated to providing worldwide seekers with accessible, confidential, and empathetic palm leaf guidance over private high-definition video consultations.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 mt-3.5">
                      {ADVISOR_DATA.globalReach.map((country) => {
                        const FlagComponent = COUNTRY_FLAG_MAP[country];
                        return (
                          <div
                            key={country}
                            className="px-3.5 py-2 sm:py-1.5 rounded-xl sm:rounded-full text-body-sm font-semibold bg-[#2433b3]/15 text-[#e6e2f8] border border-[#2433b3]/30 flex items-center gap-2.5 shadow-xs hover:bg-[#2433b3]/25 transition-colors"
                          >
                            {FlagComponent ? (
                              <FlagComponent className="w-5 h-3.5 rounded-[2px] shadow-sm shrink-0 object-cover" />
                            ) : (
                              <Globe className="w-4 h-4 shrink-0 text-[#60a5fa]" />
                            )}
                            <span>{country}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation CTA button */}
              <div className="pt-4">
                <button
                  type="button"
                  id="advisor-session-btn"
                  onClick={onOpenBooking}
                  className="px-[clamp(1.75rem,2.2vw,3rem)] py-[clamp(0.875rem,1.1vw,1.375rem)] rounded-full text-eyebrow font-bold uppercase text-[#ffffff] bg-[#2433b3] hover:bg-[#1b268a] hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-[#2433b3]/30 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Book Session</span>
                  <ArrowRight className="w-4 h-4 shrink-0 text-[#e6e2f8]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
