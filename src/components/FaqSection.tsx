import React, { useState } from 'react';
import { FAQS_DATA } from '../data/content';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

interface FaqSectionProps {
  onOpenBooking?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenBooking }) => {
  // Open the first FAQ by default
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': false,
    'faq-3': false,
  });

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faqs" className="section-y bg-[#ffffff] text-[#140d27] relative">
      <div className="shell-narrow relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-[clamp(3.5rem,6vw,7rem)]">
          <h2 className="font-serif-heading text-section font-bold text-[#140d27] capitalize text-balance mb-[clamp(1rem,1.4vw,1.75rem)]">
            Frequently Asked Questions
          </h2>
          <p className="text-lede text-[#535353] font-normal measure text-pretty tracking-[0.5px]">
            Essential answers regarding online consultations, preparation, and authentic Nadi methodology.
          </p>
        </div>

        {/* FAQs List */}
        <div className="space-y-[clamp(0.75rem,1.1vw,1.5rem)]">
          {FAQS_DATA.map((faq, index) => {
            const isOpen = !!openIds[faq.id];
            const itemNumber = (index + 1).toString().padStart(2, '0');

            return (
              <div
                key={faq.id}
                id={`faq-item-${index + 1}`}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#ffffff] border-[#2433b3] shadow-[0_24px_60px_-40px_rgba(36,51,179,0.55)]'
                    : 'bg-[#f9f9fa] border-[#d1d0dc] hover:border-[#2433b3]/40'
                }`}
              >
                <button
                  type="button"
                  id={`faq-toggle-btn-${index + 1}`}
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-[clamp(1.25rem,1.9vw,2.5rem)] text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-[clamp(1rem,1.6vw,2rem)]">
                    <span className="text-micro font-bold uppercase tracking-widest text-[#2433b3] px-2.5 py-1 rounded-md bg-[#e6e2f8] shrink-0">
                      {itemNumber}
                    </span>
                    <h3 className="font-serif-heading text-title-sm font-bold text-[#140d27] tracking-[0.5px] text-pretty">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-[clamp(2.25rem,2.4vw,3rem)] aspect-square rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#2433b3] text-[#ffffff] rotate-180'
                        : 'bg-[#140d27]/5 text-[#535353] hover:bg-[#140d27]/10'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-[clamp(1.25rem,1.9vw,2.5rem)] pb-[clamp(1.5rem,2vw,2.5rem)] pt-3 border-t border-[#d1d0dc]/70 animate-fadeIn">
                    <p className="text-body text-[#535353] font-normal pl-10 sm:pl-16 measure-wide text-pretty">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-[clamp(3rem,4vw,5rem)] p-[clamp(1.5rem,2.2vw,3rem)] rounded-3xl bg-[#0e0b14] border border-[#2433b3]/30 flex flex-col sm:flex-row items-center justify-between gap-[clamp(1rem,2vw,3rem)] text-body-sm text-[#e6e2f8]/80 shadow-[0_30px_70px_-45px_rgba(20,13,39,0.8)]">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-[#e6e2f8] shrink-0" />
            <span className="text-pretty">Have a unique inquiry regarding your thumb impression or reading?</span>
          </div>
          {onOpenBooking ? (
            <button
              type="button"
              onClick={onOpenBooking}
              className="text-[#ffffff] font-bold px-[clamp(1.5rem,1.8vw,2.5rem)] py-[clamp(0.625rem,0.9vw,1.125rem)] rounded-full bg-[#2433b3] hover:bg-[#1b268a] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
            >
              Book Session →
            </button>
          ) : (
            <a
              href="#advisor"
              className="text-[#e6e2f8] font-bold hover:underline shrink-0"
            >
              Ask During Consultation →
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
