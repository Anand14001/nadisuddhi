import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { JOURNEY_STEPS } from '../data/content';
import {
  Fingerprint,
  BookOpen,
  Compass,
  Flame,
  Sun,
  Star,
  ArrowRight,
} from 'lucide-react';

interface JourneySectionProps {
  onOpenBooking: () => void;
}

const STEP_ICONS: Record<string, React.ElementType> = {
  Fingerprint,
  BookOpen,
  Compass,
  Flame,
  Sun,
  Star,
};

/* Written as complete class strings so Tailwind's static scan keeps them. */
const PHASE_STYLES = {
  cleansing: {
    label: 'Cleansing',
    text: 'text-[#2433b3]',
    dot: 'bg-[#2433b3]',
    dotPassed: 'bg-[#2433b3]/40',
    iconActive: 'bg-[#2433b3] border-[#2433b3] text-[#ffffff]',
    iconIdle: 'bg-[#e6e2f8] border-[#e6e2f8] text-[#2433b3]',
    cardActive: 'border-[#2433b3]/40 shadow-[0_20px_50px_-30px_rgba(36,51,179,0.6)]',
  },
  awakening: {
    label: 'Awakening',
    text: 'text-[#f54b37]',
    dot: 'bg-[#f54b37]',
    dotPassed: 'bg-[#f54b37]/40',
    iconActive: 'bg-[#f54b37] border-[#f54b37] text-[#ffffff]',
    iconIdle: 'bg-[#f54b37]/10 border-[#f54b37]/10 text-[#f54b37]',
    cardActive: 'border-[#f54b37]/40 shadow-[0_20px_50px_-30px_rgba(245,75,55,0.55)]',
  },
} as const;

const PHASE_BREAK_AFTER = 4;
const TAIL_HEIGHT = 120;

export const JourneySection: React.FC<JourneySectionProps> = ({ onOpenBooking }) => {
  const listRef = useRef<HTMLOListElement>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [activeStep, setActiveStep] = useState<number>(JOURNEY_STEPS[0].number);
  const [progress, setProgress] = useState<number>(0);
  const [rail, setRail] = useState({ top: 0, height: 0 });

  /* The rail spans first node centre to last node centre. */
  useLayoutEffect(() => {
    const measureRail = () => {
      const list = listRef.current;
      const first = nodeRefs.current[0];
      const last = nodeRefs.current[JOURNEY_STEPS.length - 1];
      if (!list || !first || !last) return;

      const listTop = list.getBoundingClientRect().top;
      const firstRect = first.getBoundingClientRect();
      const lastRect = last.getBoundingClientRect();
      const top = firstRect.top + firstRect.height / 2 - listTop;
      const height = lastRect.top + lastRect.height / 2 - listTop - top;

      setRail((prev) =>
        Math.abs(prev.top - top) < 0.5 && Math.abs(prev.height - height) < 0.5
          ? prev
          : { top, height },
      );
    };

    measureRail();
    const observer = new ResizeObserver(measureRail);
    if (listRef.current) observer.observe(listRef.current);
    window.addEventListener('resize', measureRail);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measureRail);
    };
  }, []);

  /* Natural scroll drives both the progress line and the stage in focus. */
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const nodes = nodeRefs.current;
      const first = nodes[0];
      const last = nodes[JOURNEY_STEPS.length - 1];
      if (!first || !last) return;

      const focusLine = window.innerHeight * 0.55;
      const start = first.getBoundingClientRect().top + first.offsetHeight / 2;
      const end = last.getBoundingClientRect().top + last.offsetHeight / 2;

      setProgress(Math.min(1, Math.max(0, (focusLine - start) / Math.max(end - start, 1))));

      let current = JOURNEY_STEPS[0].number;
      nodes.forEach((node, index) => {
        if (node && node.getBoundingClientRect().top + node.offsetHeight / 2 <= focusLine) {
          current = JOURNEY_STEPS[index].number;
        }
      });
      setActiveStep(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      id="journey"
      className="section-y-lg bg-[#f9f9fa] text-[#140d27] relative overflow-hidden"
    >
      <div
        className="absolute inset-0 cosmic-stars-bg-light opacity-60 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-[520px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(36, 51, 179, 0.07) 0%, rgba(249, 249, 250, 0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="shell relative z-10">
        {/* Section Header */}
        <header className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-4 mb-7">
            <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#d1d0dc]" />
            <span className="text-eyebrow font-bold uppercase tracking-[0.42em] text-[#2433b3]">
              The Sacred Journey
            </span>
            <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#d1d0dc]" />
          </div>

          <h2 className="font-serif-heading text-section font-normal text-[#140d27] text-balance">
            From <span className="text-[#2433b3]">Cleansing</span>
            <br className="hidden sm:block" /> to{' '}
            <span className="text-[#f54b37]">Awakening</span>
          </h2>

          <p className="mt-[clamp(1.25rem,1.8vw,2.25rem)] text-lede text-[#535353] font-normal measure text-pretty tracking-[0.4px]">
            A 6-stage sacred process designed to locate your ancient leaf, decode repeating karmic
            knots, and anchor conscious sovereignty.
          </p>
        </header>

        {/* Thread descending from the header into the first stage.
            Tracks the rail's position so it doesn't dangle mid-screen on mobile. */}
        <div className="relative mt-[clamp(2.5rem,4vw,5rem)] h-16" aria-hidden="true">
          <div className="absolute left-[15px] lg:left-1/2 top-0 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-[#d1d0dc]" />
        </div>

        {/* Timeline */}
        <ol ref={listRef} className="relative mt-4 list-none mx-auto w-full max-w-[1500px]">
          {/* Resting rail */}
          <div
            className="absolute left-[15px] lg:left-1/2 w-px -translate-x-1/2 bg-[#d1d0dc]/70"
            style={{ top: rail.top, height: rail.height }}
            aria-hidden="true"
          />
          {/* Travelled rail — the gradient stays anchored to the full span while the mask grows */}
          <div
            className="absolute left-[15px] lg:left-1/2 w-px -translate-x-1/2 overflow-hidden"
            style={{ top: rail.top, height: rail.height * progress }}
            aria-hidden="true"
          >
            <div
              className="w-px"
              style={{
                height: rail.height,
                background:
                  'linear-gradient(to bottom, #2433b3 0%, #2433b3 58%, #f54b37 80%, #f54b37 100%)',
              }}
            />
          </div>
          {/* Tail — the thread dissolving past the final stage */}
          <div
            className="absolute left-[15px] lg:left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-[#f54b37]/35 to-transparent"
            style={{ top: rail.top + rail.height, height: TAIL_HEIGHT }}
            aria-hidden="true"
          />

          {JOURNEY_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[step.iconName] ?? Star;
            const phase = PHASE_STYLES[step.phase];
            const isActive = activeStep === step.number;
            const isPassed = step.number < activeStep;
            const onLeft = index % 2 === 0;

            return (
              <React.Fragment key={step.number}>
                <li className="relative pb-[clamp(4rem,5vw,7rem)] lg:grid lg:grid-cols-2 lg:gap-x-[clamp(2.5rem,5vw,7.5rem)]">
                  {/* Node — fixed 32px box so its centre never shifts between states */}
                  <div
                    ref={(el) => {
                      nodeRefs.current[index] = el;
                    }}
                    className="absolute left-[15px] lg:left-1/2 top-10 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center"
                    aria-hidden="true"
                  >
                    {isActive && (
                      <span className={`journey-halo absolute h-7 w-7 rounded-full ${phase.dot}`} />
                    )}
                    <span
                      className={`journey-node relative block rounded-full ring-4 ring-[#f9f9fa] transition-all duration-500 ease-out ${
                        isActive
                          ? `h-4 w-4 ${phase.dot}`
                          : isPassed
                            ? `h-2.5 w-2.5 ${phase.dotPassed}`
                            : 'h-2.5 w-2.5 bg-[#f9f9fa] border border-[#d1d0dc]'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute inset-[5px] rounded-full bg-[#ffffff]" />
                      )}
                    </span>
                  </div>

                  {/* Hairline from rail to card */}
                  <span
                    className={`hidden lg:block absolute top-14 h-px w-[clamp(1.25rem,2.5vw,3.75rem)] transition-colors duration-500 ${
                      isActive || isPassed ? 'bg-[#d1d0dc]' : 'bg-[#d1d0dc]/50'
                    } ${onLeft ? 'right-1/2' : 'left-1/2'}`}
                    aria-hidden="true"
                  />

                  {/* Card */}
                  <article
                    id={`journey-stage-${step.number}`}
                    className={`journey-card ml-11 sm:ml-14 lg:ml-0 rounded-[20px] border bg-[#ffffff] p-[clamp(1.25rem,1.9vw,2.75rem)] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-w-[640px] lg:max-w-[clamp(24rem,32vw,36rem)] ${
                      onLeft ? 'lg:col-start-1 lg:ml-auto' : 'lg:col-start-2'
                    } ${
                      isActive
                        ? `opacity-100 translate-y-0 scale-[1.015] ${
                            onLeft ? 'lg:translate-x-1.5' : 'lg:-translate-x-1.5'
                          } ${phase.cardActive}`
                        : `border-[#d1d0dc] translate-y-3 lg:translate-x-0 scale-100 shadow-none ${
                            isPassed ? 'opacity-[0.72]' : 'opacity-[0.55]'
                          }`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span
                          className={`font-serif-heading block text-numeral font-normal tracking-[1px] transition-colors duration-500 ${
                            isActive ? phase.text : 'text-[#d1d0dc]'
                          }`}
                        >
                          <span className="sr-only">Stage </span>
                          {String(step.number).padStart(2, '0')}
                        </span>
                        <span
                          className={`mt-3 inline-block text-micro font-bold uppercase tracking-[0.28em] transition-colors duration-500 ${
                            isActive ? phase.text : 'text-[#535353]/70'
                          }`}
                        >
                          {phase.label}
                        </span>
                      </div>

                      <span
                        className={`flex w-[clamp(3rem,3.4vw,4.25rem)] aspect-square shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                          isActive ? phase.iconActive : phase.iconIdle
                        }`}
                      >
                        <Icon className="h-2/5 w-2/5" strokeWidth={1.6} aria-hidden="true" />
                      </span>
                    </div>

                    <h3 className="font-serif-heading mt-6 text-title font-bold tracking-[0.5px] text-balance text-[#140d27]">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-body-sm leading-[1.7em] text-[#535353] text-pretty">
                      {step.summary}
                    </p>

                    {/* Methodology unfolds only for the stage in focus */}
                    <div
                      className={`journey-reveal grid transition-[grid-template-rows,opacity] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="mt-4 border-l border-[#d1d0dc] pl-4 text-body-sm leading-[1.75em] text-[#363746]/85 text-pretty">
                          {step.detail}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2.5 border-t border-[#d1d0dc]/70 pt-5">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500 ${
                          isActive ? phase.dot : 'bg-[#d1d0dc]'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-micro font-bold uppercase tracking-[0.2em] text-[#535353]">
                        {step.keyAction}
                      </span>
                    </div>
                  </article>
                </li>

                {/* Threshold — purification gives way to awareness */}
                {step.number === PHASE_BREAK_AFTER && (
                  <li role="presentation" className="relative pb-[clamp(4rem,5vw,7rem)]">
                    {/* Desktop: the threshold sits on the rail and masks it */}
                    <div className="relative z-[1] mx-auto hidden w-fit flex-col items-center bg-[#f9f9fa] px-6 py-6 lg:flex">
                      <span className="text-micro font-bold uppercase tracking-[0.34em] text-[#2433b3]">
                        Cleansing
                      </span>
                      <span className="my-3 flex flex-col items-center gap-2" aria-hidden="true">
                        <span className="h-px w-[clamp(4rem,5vw,7rem)] bg-[#d1d0dc]" />
                        <span className="h-1.5 w-1.5 rotate-45 border border-[#f54b37]" />
                        <span className="h-px w-[clamp(4rem,5vw,7rem)] bg-[#d1d0dc]" />
                      </span>
                      <span className="text-micro font-bold uppercase tracking-[0.34em] text-[#f54b37]">
                        Awakening
                      </span>
                      <p className="mt-5 max-w-[30ch] text-center text-body-sm leading-[1.6em] text-[#535353]/80">
                        Purification settles. Awareness begins.
                      </p>
                    </div>

                    {/* Mobile / tablet: the threshold reads alongside the rail */}
                    <div className="ml-11 sm:ml-14 lg:hidden">
                      <div className="flex items-center gap-3">
                        <span className="text-micro font-bold uppercase tracking-[0.28em] text-[#2433b3]">
                          Cleansing
                        </span>
                        <span
                          className="h-px flex-1 bg-gradient-to-r from-[#2433b3]/40 to-[#f54b37]/40"
                          aria-hidden="true"
                        />
                        <span className="text-micro font-bold uppercase tracking-[0.28em] text-[#f54b37]">
                          Awakening
                        </span>
                      </div>
                      <p className="mt-3 text-body-sm leading-[1.6em] text-[#535353]/80">
                        Purification settles. Awareness begins.
                      </p>
                    </div>
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>

        {/* Closing moment */}
        <div className="pt-[clamp(4rem,6vw,8rem)] text-center flex flex-col items-center">
          <p className="font-serif-heading text-title font-normal leading-[1.5em] tracking-[0.5px] text-[#140d27] measure-tight text-balance">
            Your journey from cleansing to awakening begins within.
          </p>
          <button
            type="button"
            id="journey-bottom-cta-btn"
            onClick={onOpenBooking}
            className="mt-[clamp(1.75rem,2.4vw,3rem)] inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#2433b3] px-[clamp(1.75rem,2.2vw,3rem)] py-[clamp(0.875rem,1.1vw,1.375rem)] text-eyebrow font-bold uppercase text-[#ffffff] shadow-md shadow-[#2433b3]/25 transition-all hover:bg-[#1b268a] whitespace-nowrap"
          >
            <span>Book Session</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
