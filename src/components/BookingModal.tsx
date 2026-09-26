import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Send, MessageSquare } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    timezone: 'IST (India Standard Time - GMT+5:30)',
    consultationType: 'Private 1-on-1 Nadi Consultation (Cleansing & Awakening)',
    gender: 'female', // for thumb impression tradition (left vs right)
    primaryFocus: 'Life Purpose & Career Direction',
    notes: '',
  });

  const handleResetAndClose = () => {
    setStep('form');
    onClose();
  };

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleResetAndClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div
      id="booking-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#140d27]/85 backdrop-blur-md animate-fadeIn flex justify-center items-center"
      style={{
        paddingTop: 'clamp(16px, 4vh, 40px)',
        paddingBottom: 'clamp(16px, 4vh, 40px)',
        paddingLeft: 'clamp(12px, 3vw, 24px)',
        paddingRight: 'clamp(12px, 3vw, 24px)',
      }}
      onClick={handleResetAndClose}
    >
      <div
        id="booking-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="relative w-full max-w-[min(100%,38rem)] max-h-[calc(100dvh-clamp(32px,8vh,80px))] max-h-[calc(100svh-clamp(32px,8vh,80px))] bg-[#1b1335] border border-[#d1d0dc]/20 rounded-2xl sm:rounded-3xl shadow-2xl text-[#ffffff] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Close Button - Always visible and accessible */}
        <button
          type="button"
          id="booking-modal-close-btn"
          onClick={handleResetAndClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 z-30 p-2 sm:p-2.5 rounded-full text-[#e6e2f8]/70 hover:text-[#ffffff] hover:bg-white/15 bg-[#140d27]/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none transition-colors cursor-pointer"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <>
            {/* Modal Header — Pinned / Sticky with clear title and breathing room */}
            <div className="shrink-0 relative px-5 sm:px-8 pt-5 sm:pt-6 pb-3.5 sm:pb-4 border-b border-white/[0.08] bg-[#1b1335] text-left sm:text-center pr-12 sm:pr-14">
              <h3
                id="booking-modal-title"
                className="font-serif-heading text-xl sm:text-2xl lg:text-3xl font-bold text-[#ffffff] leading-tight"
              >
                Book Session
              </h3>
              <p className="text-xs sm:text-sm text-[#e6e2f8]/80 mt-1 font-medium text-pretty">
                Guided by Iswariya Sivasamy — 5th-Generation Nadi & Spiritual Advisor
              </p>
            </div>

            {/* Scrollable Form Body — Smooth internal scrolling on short displays */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 modal-scrollbar overscroll-contain">
              <form onSubmit={handleSubmit} className="space-y-4 text-left pb-4">
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#e6e2f8] uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onFocus={handleInputFocus}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-[#140d27] border border-[#d1d0dc]/30 focus:border-[#2433b3] focus:ring-2 focus:ring-[#2433b3]/30 text-sm text-[#ffffff] placeholder-[#e6e2f8]/40 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#e6e2f8] uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onFocus={handleInputFocus}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#140d27] border border-[#d1d0dc]/30 focus:border-[#2433b3] focus:ring-2 focus:ring-[#2433b3]/30 text-sm text-[#ffffff] placeholder-[#e6e2f8]/40 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Phone / WhatsApp & Timezone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#e6e2f8] uppercase tracking-wider mb-1.5">
                      WhatsApp / Phone (with country code) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onFocus={handleInputFocus}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-[#140d27] border border-[#d1d0dc]/30 focus:border-[#2433b3] focus:ring-2 focus:ring-[#2433b3]/30 text-sm text-[#ffffff] placeholder-[#e6e2f8]/40 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#e6e2f8] uppercase tracking-wider mb-1.5">
                      Your Timezone *
                    </label>
                    <select
                      value={formData.timezone}
                      onFocus={handleInputFocus}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#140d27] border border-[#d1d0dc]/30 focus:border-[#2433b3] focus:ring-2 focus:ring-[#2433b3]/30 text-sm text-[#ffffff] outline-none transition-all cursor-pointer"
                    >
                      <option value="IST (India Standard Time - GMT+5:30)">IST (India / Sri Lanka)</option>
                      <option value="EST (US Eastern Time - GMT-5)">EST (USA / Canada East)</option>
                      <option value="PST (US Pacific Time - GMT-8)">PST (USA / Canada West)</option>
                      <option value="CST (US Central Time - GMT-6)">CST (USA Central)</option>
                      <option value="GMT (UK / London - GMT+0)">GMT / BST (United Kingdom)</option>
                      <option value="GST (Dubai / UAE - GMT+4)">GST (UAE & Gulf)</option>
                      <option value="SGT (Singapore / Malaysia - GMT+8)">SGT (Singapore / Malaysia)</option>
                      <option value="AEST (Australia Sydney/Melbourne - GMT+10)">AEST (Australia)</option>
                      <option value="CET (Central European Time - GMT+1)">CET (Europe)</option>
                    </select>
                  </div>
                </div>

                {/* Thumb Impression Selection (Tradition Specific) */}
                <div>
                  <label className="block text-xs font-bold text-[#e6e2f8] uppercase tracking-wider mb-1.5">
                    Gender (Required for Thumb Impression Tradition)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'female' })}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                        formData.gender === 'female'
                          ? 'bg-[#2433b3] border-[#2433b3] text-[#ffffff] shadow-md shadow-[#2433b3]/30'
                          : 'bg-[#140d27] border-[#d1d0dc]/30 text-[#e6e2f8]/70 hover:border-white/30'
                      }`}
                    >
                      <span>Female</span>
                      <span className="text-[10px] opacity-80">(Left Thumb)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'male' })}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                        formData.gender === 'male'
                          ? 'bg-[#2433b3] border-[#2433b3] text-[#ffffff] shadow-md shadow-[#2433b3]/30'
                          : 'bg-[#140d27] border-[#d1d0dc]/30 text-[#e6e2f8]/70 hover:border-white/30'
                      }`}
                    >
                      <span>Male</span>
                      <span className="text-[10px] opacity-80">(Right Thumb)</span>
                    </button>
                  </div>
                </div>

                {/* Primary Focus Area */}
                <div>
                  <label className="block text-xs font-bold text-[#e6e2f8] uppercase tracking-wider mb-1.5">
                    Primary Area of Inquiry
                  </label>
                  <select
                    value={formData.primaryFocus}
                    onFocus={handleInputFocus}
                    onChange={(e) => setFormData({ ...formData, primaryFocus: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#140d27] border border-[#d1d0dc]/30 focus:border-[#2433b3] focus:ring-2 focus:ring-[#2433b3]/30 text-sm text-[#ffffff] outline-none transition-all cursor-pointer"
                  >
                    <option value="Life Purpose & Career Direction">Life Purpose, Destiny & Career Direction</option>
                    <option value="Releasing Recurring Karmic Knots (Nadi Mudichu)">Releasing Recurring Karmic Knots (Nadi Mudichu)</option>
                    <option value="Relationships & Ancestral Harmony">Relationships & Ancestral Harmony</option>
                    <option value="Health, Well-being & Spiritual Seva">Health, Well-being & Spiritual Seva</option>
                    <option value="Comprehensive 6-Stage Reading">Complete Comprehensive Reading & Remedies</option>
                  </select>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#e6e2f8] uppercase tracking-wider mb-1.5">
                    Brief Note or Questions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onFocus={handleInputFocus}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Share any recurring patterns or questions you wish to address..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140d27] border border-[#d1d0dc]/30 focus:border-[#2433b3] focus:ring-2 focus:ring-[#2433b3]/30 text-sm text-[#ffffff] placeholder-[#e6e2f8]/40 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit CTA & Bottom Breathing Room */}
                <div className="pt-2 pb-2">
                  <button
                    type="submit"
                    id="booking-submit-btn"
                    className="w-full py-3.5 sm:py-4 rounded-full font-bold text-sm uppercase tracking-wider text-[#ffffff] bg-[#2433b3] hover:bg-[#1b268a] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#2433b3]/35 active:scale-[0.99]"
                  >
                    <span>Submit Session Request</span>
                    <Send className="w-4 h-4 text-[#ffffff]" />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Confirmation State */
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-7 modal-scrollbar overscroll-contain">
            <div className="py-2 text-center space-y-5 max-w-lg mx-auto">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#e6e2f8] border-2 border-[#2433b3] mx-auto flex items-center justify-center text-[#2433b3]">
                <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#2433b3] bg-[#e6e2f8] px-3 py-1 rounded-full">
                  Request Registered
                </span>
                <h3 className="font-serif-heading text-xl sm:text-2xl lg:text-3xl font-bold text-[#ffffff] mt-3">
                  Welcome to your Nadi Sudhi Journey
                </h3>
                <p className="text-xs sm:text-sm text-[#e6e2f8]/80 max-w-md mx-auto mt-2 leading-relaxed font-normal">
                  Thank you, <strong className="text-[#ffffff]">{formData.fullName || 'Seeker'}</strong>. Your consultation request has been prepared for Iswariya Sivasamy.
                </p>
              </div>

              {/* Preparation Steps Summary Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#140d27] border border-[#d1d0dc]/20 text-left space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-[#ffffff] font-bold border-b border-white/10 pb-2 flex items-center gap-2">
                  <span>Next Preparation Steps</span>
                </h4>
                <div className="text-xs text-[#e6e2f8]/80 space-y-2 leading-relaxed">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-[#2433b3]">1.</span>
                    <span>
                      Take a clear, well-lit photo of your{' '}
                      <strong className="text-[#ffffff]">
                        {formData.gender === 'male' ? 'Right Thumb' : 'Left Thumb'}
                      </strong>{' '}
                      impression on white paper using ink or blue stamp pad.
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-[#2433b3]">2.</span>
                    <span>
                      Our coordinator will reach out to you via WhatsApp at{' '}
                      <strong className="text-[#ffffff]">{formData.phone || 'your phone number'}</strong> or email ({formData.email}) to coordinate time slots matching your timezone ({formData.timezone}).
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-[#2433b3]">3.</span>
                    <span>
                      Your private video consultation link will be dispatched once your palm-leaf bundle index is verified.
                    </span>
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 pb-4">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Namaste Iswariya Sivasamy. I have registered for a private Nadi Sudhi consultation. Name: ${formData.fullName}, Focus: ${formData.primaryFocus}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ffffff] bg-[#2433b3] hover:bg-[#1b268a] transition-colors cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
