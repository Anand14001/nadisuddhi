import React from 'react';
import { SITE_METADATA } from '../data/content';
import { ArrowRight, MapPin, Globe } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  return (
    <footer id="main-footer" className="bg-[#0e081c] border-t border-[#d1d0dc]/15 pt-[clamp(4rem,6vw,8rem)] pb-[clamp(3rem,4vw,5.5rem)] text-[#e6e2f8]/75">
      <div className="shell">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[clamp(2.5rem,4vw,6rem)] pb-[clamp(3rem,4.5vw,6rem)] border-b border-[#d1d0dc]/15">
          {/* Brand & Lineage Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center">
              <img
                src={SITE_METADATA.titleLogoUrl}
                alt="Nadisuddhi Title Logo"
                className="h-auto w-auto max-h-[clamp(3.5rem,4.2vw,5.75rem)] max-w-full object-contain object-left brightness-125 filter drop-shadow-[0_2px_12px_rgba(36,51,179,0.3)]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <p className="font-serif-heading text-body-lg font-semibold text-[#e6e2f8]">
              {SITE_METADATA.tagline}
            </p>

            <p className="text-body-sm text-[#e6e2f8]/70 measure leading-[1.6em] text-pretty">
              Ancient Nadi Wisdom for Global Seekers — Guided by Iswariya Sivasamy, 5th-generation practitioner carrying forward a sacred lineage originating from Vaitheeswaran Koil, Tamil Nadu.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-body-sm text-[#e6e2f8]/80 pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2433b3]" />
                Vaitheeswaran Koil, Tamil Nadu
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#2433b3]" />
                Worldwide Online Video Sessions
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif-heading text-eyebrow uppercase tracking-widest text-[#ffffff] font-bold">
              Navigation
            </h4>
            <ul className="space-y-3 text-body-sm">
              <li>
                <a href="#how-it-helps" className="hover:text-[#ffffff] transition-colors">
                  What It Means / How It Helps
                </a>
              </li>
              <li>
                <a href="#advisor" className="hover:text-[#ffffff] transition-colors">
                  Meet Advisor (Iswariya Sivasamy)
                </a>
              </li>
              <li>
                <a href="#journey" className="hover:text-[#ffffff] transition-colors">
                  The 6-Step Journey
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-[#ffffff] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Session Booking */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif-heading text-eyebrow uppercase tracking-widest text-[#ffffff] font-bold">
              Private Consultations
            </h4>
            <p className="text-body-sm text-[#e6e2f8]/70 leading-relaxed text-pretty">
              Serving seekers across USA, UK, Canada, UAE, Australia, Singapore, India, and worldwide.
            </p>
            <button
              type="button"
              id="footer-book-btn"
              onClick={onOpenBooking}
              className="px-[clamp(1.5rem,1.8vw,2.5rem)] py-[clamp(0.75rem,1vw,1.25rem)] rounded-full text-eyebrow font-bold uppercase text-[#ffffff] bg-[#2433b3] hover:bg-[#1b268a] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#2433b3]/30 whitespace-nowrap group"
            >
              <span>Book Session</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 text-[#e6e2f8] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-[clamp(2.5rem,3.5vw,4.5rem)] space-y-4 text-center">
          <div className="p-[clamp(1.125rem,1.6vw,2rem)] rounded-2xl bg-[#140d27] border border-[#d1d0dc]/15 measure-wide mx-auto">
            <p className="text-body-sm text-[#e6e2f8]/60 leading-relaxed italic text-pretty">
              {SITE_METADATA.disclaimer}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-body-sm text-[#e6e2f8]/50 measure-wide mx-auto pt-4">
            <p>© {new Date().getFullYear()} Nadisuddhi. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">
              Powered by{' '}
              <a
                href="https://digital-dude.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e6e2f8]/80 hover:text-[#ffffff] underline decoration-[#2433b3] decoration-1 underline-offset-4 hover:decoration-[#ffffff] transition-colors font-medium"
              >
                Digital Dude
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
