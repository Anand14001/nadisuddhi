import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { SITE_METADATA } from '../data/content';
import { Menu, X, Calendar, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const barRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'How It Helps', href: '#how-it-helps' },
    { label: 'Meet Advisor', href: '#advisor' },
    { label: 'The 6-Step Journey', href: '#journey' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQs', href: '#faqs' },
  ];

  /* Publish the bar's height so the hero, the drawer and anchor offsets follow it
     instead of hardcoding a pixel guess that desyncs when the logo resizes.
     Measured on the bar row only, so opening the drawer doesn't inflate it. */
  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const apply = () => {
      document.documentElement.style.setProperty(
        '--nav-h',
        `${Math.round(bar.getBoundingClientRect().bottom)}px`,
      );
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(bar);
    return () => observer.disconnect();
  }, [isScrolled]);

  useEffect(() => {
    const sectionIds = ['home', 'how-it-helps', 'advisor', 'journey', 'testimonials', 'faqs'];

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const scrollPosition = window.scrollY + 220;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(`#${id}`);
            return;
          }
        }
      }
      setActiveSection('#home');
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setActiveSection(href);
    setIsMobileMenuOpen(false);

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300"
    >
      <div
        ref={barRef}
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md py-2.5 sm:py-3'
            : 'bg-white py-3 sm:py-4 lg:py-5'
        }`}
      >
        <div className="shell-wide flex items-center justify-between gap-[clamp(0.75rem,2vw,3rem)]">
        {/* Brand Title Logo — the one flexible item in the bar, so on narrow
            screens it yields to the CTA and menu toggle rather than overflowing. */}
        <a
          href="#home"
          id="navbar-brand-link"
          onClick={(e) => handleLinkClick(e, '#home')}
          className="flex items-center group transition-transform duration-300 min-w-0 shrink"
          aria-label="Nadisuddhi Home"
        >
          <img
            src={SITE_METADATA.titleLogoUrl}
            alt="Nadisuddhi"
            className="h-auto w-auto max-h-[clamp(3.25rem,4.4vw,6rem)] max-w-full object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </a>

        {/* Desktop Navigation Links (Visible on lg 1024px and above) with Active Highlight */}
        <nav
          className="hidden lg:flex items-center gap-[clamp(1.25rem,2.1vw,3.25rem)] shrink-0"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                id={`nav-link-${link.href.replace('#', '')}`}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`group relative text-nav transition-all duration-200 tracking-wide py-1.5 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#181126] font-bold'
                    : 'text-[#181126] hover:text-[#4338ca] font-medium'
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#4338ca] transition-all duration-300 rounded-full ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* CTA Button & Tablet/Mobile Controls */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Tablet & Desktop Primary CTA: "Book Session" */}
          <button
            type="button"
            id="navbar-book-session-btn"
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center gap-2 px-[clamp(1.25rem,1.6vw,2.25rem)] py-[clamp(0.625rem,0.75vw,1rem)] rounded-full text-eyebrow uppercase font-bold tracking-wider text-[#ffffff] bg-[#2433b3] hover:bg-[#1b268a] hover:-translate-y-0.5 transition-all duration-200 shadow-md shadow-[#2433b3]/30 active:scale-95 cursor-pointer border border-[#2433b3] whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Book Session</span>
          </button>

          {/* Mobile direct mini book button: "Book Session" */}
          <button
            type="button"
            id="navbar-mobile-book-btn"
            onClick={onOpenBooking}
            className="sm:hidden px-3.5 py-2 rounded-full text-xs uppercase font-bold tracking-wider text-[#ffffff] bg-[#2433b3] hover:bg-[#1b268a] flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 text-white" />
            <span>Book Session</span>
          </button>

          {/* Menu toggle button for Mobile AND Tablet (< 1024px) */}
          <button
            type="button"
            id="navbar-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl text-[#181126] bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>
      </div>

      {/* Tablet & Mobile Slide-down Drawer with Active Tab Highlighting */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-x-0 bottom-0 top-[var(--nav-h,4.75rem)] bg-black/50 backdrop-blur-sm lg:hidden -z-10"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            id="navbar-mobile-menu"
            className="lg:hidden bg-white border-b border-slate-200 px-6 sm:px-10 py-7 space-y-6 shadow-2xl animate-fadeIn"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`text-base sm:text-lg py-3 px-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'text-[#2433b3] font-bold bg-[#2433b3]/10 border-[#2433b3]/30 shadow-sm'
                        : 'text-[#181126] hover:text-[#4338ca] hover:bg-slate-50 border-transparent font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>{link.label}</span>
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isActive
                          ? 'text-white bg-[#2433b3] px-2.5 py-1 rounded-full'
                          : 'text-[#4338ca]'
                      }`}
                    >
                      {isActive ? 'Current' : '→'}
                    </span>
                  </a>
                );
              })}
            </div>
            <div className="pt-2">
              <button
                type="button"
                id="navbar-mobile-drawer-book-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-4 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider text-[#ffffff] bg-[#2433b3] hover:bg-[#1b268a] flex items-center justify-center gap-2 shadow-xl shadow-[#2433b3]/30 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Book Session</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
