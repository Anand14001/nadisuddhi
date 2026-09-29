import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  VIDEO_TESTIMONIALS,
  TESTIMONIAL_IMAGES,
  CLOUDINARY_BASE,
} from '../data/content';
import { TestimonialFormat, VideoTestimonial } from '../types';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';

/* Poster sources, best first.
   Shorts expose `oar2` — the untouched vertical frame. Standard uploads
   fall back to `maxresdefault` or `hqdefault`. */
const POSTER_VARIANTS: Record<TestimonialFormat, string[]> = {
  portrait: ['oar2', 'oardefault', 'maxresdefault', 'hqdefault'],
  landscape: ['maxresdefault', 'hqdefault'],
};

const SWIPE_THRESHOLD = 40;
const SET_SIZE = VIDEO_TESTIMONIALS.length;
// 3 consecutive sets to guarantee seamless infinite looping in both directions
const TRIPLE_TESTIMONIALS = [
  ...VIDEO_TESTIMONIALS,
  ...VIDEO_TESTIMONIALS,
  ...VIDEO_TESTIMONIALS,
];

/* Cloudinary delivery for photograph gallery. */
const photoUrl = (assetPath: string, width: number) =>
  `${CLOUDINARY_BASE}/f_auto,q_auto,c_limit,w_${width}/${assetPath}`;

const photoSrcSet = (assetPath: string, intrinsicWidth: number) =>
  [480, 760, 1100, 1600]
    .filter((w) => w <= intrinsicWidth)
    .map((w) => `${photoUrl(assetPath, w)} ${w}w`)
    .join(', ');

/** The name we are willing to print. */
const displayName = (item: VideoTestimonial) => item.person ?? 'Nadi Sudhi Seeker';

const VideoPoster: React.FC<{
  item: VideoTestimonial;
  alt: string;
  eager: boolean;
}> = ({ item, alt, eager }) => {
  const [step, setStep] = useState(0);

  if (item.type === 'mp4') {
    const posterSrc =
      item.posterUrl ||
      (item.src ? item.src.replace(/\.[^/.]+$/, '.jpg') : '');
    return (
      <img
        src={posterSrc}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover object-center"
      />
    );
  }

  const variants = POSTER_VARIANTS[item.format];

  return (
    <img
      src={`https://i.ytimg.com/vi/${item.videoId}/${variants[step]}.jpg`}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => setStep((s) => (s < variants.length - 1 ? s + 1 : s))}
      className="h-full w-full object-cover object-center"
    />
  );
};

export const TestimonialsSection: React.FC = () => {
  // Canonical active track index starts in Set 1 (index 6, which maps to item 0)
  const [activeTrackIndex, setActiveTrackIndex] = useState(SET_SIZE);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isCloudinaryPlaying, setIsCloudinaryPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [stageWidth, setStageWidth] = useState(1200);

  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);

  // Single authoritative reference for the Cloudinary HTML5 video element
  const cloudinaryVideoRef = useRef<HTMLVideoElement | null>(null);

  // Active canonical item index (0..5)
  const activeItemIndex = ((activeTrackIndex % SET_SIZE) + SET_SIZE) % SET_SIZE;
  const activeItem = VIDEO_TESTIMONIALS[activeItemIndex];

  // Pause the Cloudinary video element explicitly and verify state
  const pauseCloudinaryVideo = useCallback(() => {
    const video = cloudinaryVideoRef.current;
    if (video) {
      video.pause();
      console.log('Cloudinary video paused:', video.paused);
      console.log('Cloudinary video ended:', video.ended);
      console.log('Cloudinary video currentTime:', video.currentTime);
      if (video.paused !== true) {
        console.warn('Cloudinary video pause verification failed, retrying...');
        video.pause();
      }
    }
    // Safeguard: ensure any other video elements in DOM are paused as well
    if (typeof document !== 'undefined') {
      const allVideos = document.querySelectorAll('video');
      allVideos.forEach((v) => {
        if (!v.paused) {
          v.pause();
        }
      });
    }
    setIsCloudinaryPlaying(false);
  }, []);

  const handleCloudinaryPlay = async () => {
    const video = cloudinaryVideoRef.current;
    if (!video) return;

    try {
      await video.play();
      console.log('Cloudinary video started playing, paused:', video.paused);
      setIsCloudinaryPlaying(true);
      setPlayingId('testimonial-02');
    } catch (error) {
      console.error('Cloudinary video playback failed:', error);
    }
  };

  const handleCloudinaryPause = () => {
    const video = cloudinaryVideoRef.current;
    if (!video) return;

    video.pause();
    console.log('Cloudinary video paused:', video.paused);
    console.log('Cloudinary video ended:', video.ended);
    console.log('Cloudinary video currentTime:', video.currentTime);

    if (video.paused !== true) {
      console.warn('Cloudinary video pause verification failed, retrying...');
      video.pause();
    }

    setIsCloudinaryPlaying(false);
    setPlayingId(null);
  };

  const toggleCloudinaryPlayback = () => {
    const video = cloudinaryVideoRef.current;
    if (!video) return;

    if (video.paused) {
      handleCloudinaryPlay();
    } else {
      handleCloudinaryPause();
    }
  };

  const handleVideoPlayEvent = () => {
    const video = cloudinaryVideoRef.current;
    if (video) {
      console.log('Cloudinary onPlay event, paused:', video.paused);
    }
    setIsCloudinaryPlaying(true);
    setPlayingId('testimonial-02');
  };

  const handleVideoPauseEvent = () => {
    const video = cloudinaryVideoRef.current;
    if (video) {
      console.log('Cloudinary onPause event, paused:', video.paused, 'currentTime:', video.currentTime);
    }
    setIsCloudinaryPlaying(false);
    setPlayingId(null);
  };

  const handleVideoEndedEvent = () => {
    console.log('Cloudinary onEnded event');
    setIsCloudinaryPlaying(false);
    setPlayingId(null);
  };

  // Section 10: Cleanup on unmount
  useEffect(() => {
    return () => {
      const video = cloudinaryVideoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.removeAttribute('src');
        video.load();
      }
    };
  }, []);

  // Section 6: Pause Cloudinary video whenever it leaves the active position
  useEffect(() => {
    if (activeItem.type !== 'mp4') {
      pauseCloudinaryVideo();
    }
  }, [activeItem, pauseCloudinaryVideo]);

  // Measure stage width for exact pixel-perfect centering
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const updateSize = () => {
      if (stageRef.current) {
        setStageWidth(stageRef.current.clientWidth);
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Compute card dimensions: uniform 9:16 portrait frames for all videos
  const isMobile = stageWidth < 640;
  const cardWidth = isMobile
    ? Math.min(Math.round(stageWidth * 0.84), 320)
    : stageWidth < 1024
    ? Math.min(Math.max(Math.round(stageWidth * 0.28), 240), 280)
    : Math.min(Math.max(Math.round(stageWidth * 0.22), 290), 330);
  const cardGap = isMobile ? 16 : stageWidth < 1024 ? 24 : 32;
  const cardHeight = Math.round(cardWidth * (16 / 9));
  const stageHeight = cardHeight + 48;

  // Exact center calculation: centers activeTrackIndex directly at stageWidth / 2
  const translateX = Math.round(
    stageWidth / 2 - (activeTrackIndex * (cardWidth + cardGap) + cardWidth / 2)
  );

  // Re-enable transition after instantaneous canonical reset
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Listen for YouTube player state via postMessage (stop playing when video ends)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        if (data && data.event === 'infoDelivery' && data.info) {
          if (data.info.playerState === 0) {
            // Video ended: clear playingId so auto-slide timer resumes
            setPlayingId(null);
          }
        }
      } catch {
        // Non-JSON iframe message; safely ignore
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleNext = useCallback(() => {
    pauseCloudinaryVideo();
    setPlayingId(null);
    setIsTransitioning(true);
    setActiveTrackIndex((prev) => prev + 1);
  }, [pauseCloudinaryVideo]);

  const handlePrev = useCallback(() => {
    pauseCloudinaryVideo();
    setPlayingId(null);
    setIsTransitioning(true);
    setActiveTrackIndex((prev) => prev - 1);
  }, [pauseCloudinaryVideo]);

  const handleDotClick = useCallback((targetItemIndex: number) => {
    pauseCloudinaryVideo();
    setPlayingId(null);
    setIsTransitioning(true);
    setActiveTrackIndex((prev) => {
      const currentItem = ((prev % SET_SIZE) + SET_SIZE) % SET_SIZE;
      let diff = targetItemIndex - currentItem;
      if (diff > SET_SIZE / 2) diff -= SET_SIZE;
      if (diff < -SET_SIZE / 2) diff += SET_SIZE;
      return prev + diff;
    });
  }, [pauseCloudinaryVideo]);

  // 2-second automatic slide change:
  // PAUSED when a video is playing, or user hovers, or user touches/swipes.
  // NEVER autoplays any video.
  useEffect(() => {
    if (playingId !== null || isCloudinaryPlaying || isHovered || isInteracting) {
      return;
    }
    const timer = setInterval(() => {
      handleNext();
    }, 2000);
    return () => clearInterval(timer);
  }, [playingId, isCloudinaryPlaying, isHovered, isInteracting, handleNext]);

  // Seamless infinite loop snap on transition end
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLUListElement>) => {
    if (e.target !== trackRef.current) return;
    const canonical = SET_SIZE + (((activeTrackIndex % SET_SIZE) + SET_SIZE) % SET_SIZE);
    if (canonical !== activeTrackIndex) {
      setIsTransitioning(false);
      setActiveTrackIndex(canonical);
    }
  };

  const handleCardClick = (clickedTrackIndex: number, item: VideoTestimonial) => {
    if (consumedBySwipe()) return;
    if (clickedTrackIndex === activeTrackIndex) {
      // User explicitly clicked the active center card
      if (item.type === 'mp4') {
        toggleCloudinaryPlayback();
      } else {
        setPlayingId(item.id);
      }
    } else {
      // User clicked a side preview: explicitly pause any playing video, smoothly navigate to center it
      pauseCloudinaryVideo();
      setPlayingId(null);
      setIsTransitioning(true);
      setActiveTrackIndex(clickedTrackIndex);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    }
  };

  const onPointerDown = (event: React.PointerEvent) => {
    didSwipe.current = false;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    setIsInteracting(true);
  };

  const onPointerUp = (event: React.PointerEvent) => {
    setIsInteracting(false);
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    didSwipe.current = true;
    if (dx < 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const onPointerCancel = () => {
    pointerStart.current = null;
    setIsInteracting(false);
  };

  const consumedBySwipe = () => {
    if (!didSwipe.current) return false;
    didSwipe.current = false;
    return true;
  };

  return (
    <section
      id="testimonials"
      className="section-y-lg relative overflow-hidden bg-[#140d27]"
    >
      {/* Atmosphere: stars and celestial pool */}
      <div
        className="cosmic-stars-bg pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-[18%] h-[60%]"
        style={{
          background:
            'radial-gradient(ellipse 55% 70% at 50% 50%, rgba(36, 51, 179, 0.24) 0%, rgba(20, 13, 39, 0) 72%)',
        }}
        aria-hidden="true"
      />

      <div className="shell relative z-10">
        <header className="flex flex-col items-center text-center">
          <div className="mb-7 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#e6e2f8]/40 sm:w-16" />
            <span className="text-eyebrow font-bold uppercase tracking-[0.42em] text-[#f54b37]">
              Real Experiences
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#e6e2f8]/40 sm:w-16" />
          </div>

          <h2 className="font-serif-heading text-section font-normal text-balance text-[#ffffff]">
            What Seekers <span className="text-[#e6e2f8]">Experience</span>
          </h2>

          <p className="measure mt-[clamp(1.25rem,1.8vw,2.25rem)] text-lede font-normal tracking-[0.4px] text-pretty text-[#e6e2f8]/75">
            Hear directly from people who have experienced the Nadi Sudhi journey.
          </p>
        </header>
      </div>

      {/* ------------------------------------------------------------------
          Video Carousel:
          LEFT VIDEO → CENTER ACTIVE VIDEO → RIGHT VIDEO
          All cards uniform 9:16 portrait. Center video always in focus.
          ------------------------------------------------------------------ */}
      <div
        className="relative z-10 mt-[clamp(2.5rem,5vw,5rem)]"
        role="group"
        aria-roledescription="carousel"
        aria-label="Video testimonials"
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={stageRef}
          className="testimonial-stage relative w-full overflow-hidden"
          style={{ height: `${stageHeight}px`, touchAction: 'pan-y' }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <ul
            ref={trackRef}
            onTransitionEnd={handleTransitionEnd}
            className="testimonial-track absolute top-0 left-0 flex h-full list-none items-center"
            style={{
              gap: `${cardGap}px`,
              transform: `translate3d(${translateX}px, 0, 0)`,
              transition: isTransitioning
                ? 'transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1)'
                : 'none',
            }}
          >
            {TRIPLE_TESTIMONIALS.map((item, index) => {
              const dist = index - activeTrackIndex;
              const absDist = Math.abs(dist);
              const isActive = dist === 0;
              const isNeighbor = absDist === 1;
              const isYouTubePlaying = item.type === 'youtube' && isActive && playingId === item.id;
              const isCloudinaryActive = item.type === 'mp4' && isActive;
              const portrait = item.format === 'portrait';

              return (
                <li
                  key={`${item.id}-${index}`}
                  className={`testimonial-slide relative shrink-0 overflow-hidden rounded-2xl select-none ${
                    isActive
                      ? 'z-20 border-2 border-[#f54b37] shadow-[0_22px_60px_-10px_rgba(36,51,179,0.75),0_0_30px_rgba(245,75,55,0.4)]'
                      : 'border border-[#e6e2f8]/15 shadow-lg shadow-black/40'
                  }`}
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    aspectRatio: '9 / 16',
                    transform: isActive
                      ? 'scale(1)'
                      : isNeighbor
                      ? 'scale(0.85)'
                      : 'scale(0.72)',
                    opacity: isActive
                      ? 1
                      : isNeighbor
                      ? isMobile
                        ? 0
                        : 0.52
                      : isMobile
                      ? 0
                      : 0.15,
                    pointerEvents: isActive || isNeighbor ? 'auto' : 'none',
                  }}
                  aria-hidden={!isActive}
                >
                  {isCloudinaryActive ? (
                    <div className="relative h-full w-full overflow-hidden">
                      <video
                        ref={cloudinaryVideoRef}
                        src={item.src}
                        poster={item.posterUrl || (item.src ? item.src.replace(/\.[^/.]+$/, '.jpg') : undefined)}
                        title={item.sourceTitle}
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover object-center pointer-events-auto"
                        onPlay={handleVideoPlayEvent}
                        onPause={handleVideoPauseEvent}
                        onEnded={handleVideoEndedEvent}
                      />

                      {/* Dark overlay: subtle when playing, clear gradient when paused */}
                      <span
                        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                          isCloudinaryPlaying
                            ? 'bg-gradient-to-t from-[#140d27]/70 via-transparent to-transparent'
                            : 'bg-gradient-to-t from-[#140d27]/90 via-[#140d27]/15 to-transparent'
                        }`}
                        aria-hidden="true"
                      />

                      {/* Format Badge at Top Left */}
                      <div className="pointer-events-none absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium tracking-wide shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f54b37] animate-pulse" />
                        <span>Experience</span>
                      </div>

                      {/* Custom Centered Play / Pause Button */}
                      <button
                        type="button"
                        id={`testimonial-slide-btn-${index + 1}`}
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCloudinaryPlayback();
                        }}
                        aria-label={
                          isCloudinaryPlaying
                            ? `Pause testimonial: ${item.sourceTitle}`
                            : `Play testimonial: ${item.sourceTitle}`
                        }
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 z-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f54b37] ${
                          isCloudinaryPlaying
                            ? 'h-16 w-16 sm:h-18 sm:w-18 bg-[#140d27]/75 hover:bg-[#f54b37] text-white border-2 border-white/40 shadow-lg opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity'
                            : 'h-16 w-16 sm:h-18 sm:w-18 bg-[#f54b37] text-white border-2 border-white/40 shadow-[0_10px_30px_rgba(245,75,55,0.5),0_0_20px_rgba(245,75,55,0.3)] hover:scale-110 hover:shadow-[0_15px_40px_rgba(245,75,55,0.7)]'
                        }`}
                      >
                        {isCloudinaryPlaying ? (
                          <Pause className="h-7 w-7 fill-current text-white" />
                        ) : (
                          <Play className="h-7 w-7 translate-x-[2px] fill-current text-white" />
                        )}
                      </button>

                      {/* Transparent click area across the card to toggle play/pause */}
                      <div
                        className="absolute inset-0 z-10 cursor-pointer"
                        onClick={() => toggleCloudinaryPlayback()}
                        aria-hidden="true"
                      />

                      {/* Bottom Speaker / Seeker details */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3.5 sm:p-4 pt-10 bg-gradient-to-t from-[#140d27]/95 via-[#140d27]/60 to-transparent text-left">
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-[#f54b37]/25 border border-[#f54b37]/60 text-[10px] font-bold text-[#f54b37]">
                            ॐ
                          </div>
                          <span className="block truncate text-xs sm:text-sm font-semibold text-white drop-shadow-md">
                            {displayName(item)}
                          </span>
                        </div>
                        {item.location ? (
                          <p className="mt-0.5 pl-7 sm:pl-8 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-[#e6e2f8]/75 drop-shadow">
                            {item.location}
                          </p>
                        ) : (
                          <p className="mt-0.5 pl-7 sm:pl-8 text-[10px] sm:text-[11px] font-medium text-[#e6e2f8]/60 drop-shadow truncate">
                            Nadi Sudhi Seeker
                          </p>
                        )}
                      </div>
                    </div>
                  ) : isYouTubePlaying ? (
                    portrait ? (
                      /* Vertical Shorts: 9:16 iframe fits card 100% */
                      <iframe
                        className="h-full w-full border-0 pointer-events-auto"
                        src={`https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1${
                          item.startAt ? `&start=${item.startAt}` : ''
                        }`}
                        title={item.sourceTitle}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      /* Landscape videos: centered crop container preserving 16:9 ratio and faces */
                      <div className="absolute inset-0 overflow-hidden">
                        <iframe
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-auto"
                          style={{
                            width: '316.2%',
                            height: '100%',
                            maxWidth: 'none',
                          }}
                          src={`https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1${
                            item.startAt ? `&start=${item.startAt}` : ''
                          }`}
                          title={item.sourceTitle}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    )
                  ) : (
                    <button
                      type="button"
                      id={`testimonial-slide-btn-${index + 1}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => handleCardClick(index, item)}
                      aria-label={
                        isActive
                          ? `Play testimonial: ${item.sourceTitle}`
                          : `Show testimonial: ${item.sourceTitle}`
                      }
                      className="group relative block h-full w-full cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f54b37]"
                    >
                      {/* Video Poster: object-cover guarantees no distortion for portrait or landscape */}
                      <VideoPoster
                        item={item}
                        alt={`Video testimonial: ${item.sourceTitle}`}
                        eager={absDist <= 1}
                      />

                      {/* Dark overlay: clear for active, subtle for neighbors */}
                      <span
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          isActive
                            ? 'bg-gradient-to-t from-[#140d27]/90 via-[#140d27]/15 to-transparent'
                            : 'bg-[#140d27]/45'
                        }`}
                        aria-hidden="true"
                      />

                      {/* Format Badge at Top Left */}
                      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium tracking-wide shadow-sm">
                        {item.type === 'youtube' && portrait ? (
                          <>
                            <svg
                              className="w-3.5 h-3.5 text-[#f54b37]"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.49-4.5c1.29-.68 2.07-2.04 2-3.49-.07-1.42-.93-2.67-2.23-3.25zM10 14.5v-5l4.5 2.5-4.5 2.5z" />
                            </svg>
                            <span>Shorts</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f54b37] animate-pulse" />
                            <span>Experience</span>
                          </>
                        )}
                      </div>

                      {/* Prominent Custom Centered Play Button */}
                      <span
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 ${
                          isActive
                            ? 'h-16 w-16 sm:h-18 sm:w-18 bg-[#f54b37] text-white border-2 border-white/40 shadow-[0_10px_30px_rgba(245,75,55,0.5),0_0_20px_rgba(245,75,55,0.3)] group-hover:scale-110 group-hover:shadow-[0_15px_40px_rgba(245,75,55,0.7)]'
                            : 'h-11 w-11 border border-white/25 bg-[#140d27]/60 text-white/80'
                        }`}
                        aria-hidden="true"
                      >
                        <Play
                          className={
                            isActive
                              ? 'h-7 w-7 translate-x-[2px] fill-current text-white'
                              : 'h-4 w-4 translate-x-[1px] fill-current text-white/90'
                          }
                        />
                      </span>

                      {/* Bottom Speaker / Seeker details */}
                      <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 sm:p-4 pt-10 bg-gradient-to-t from-[#140d27]/95 via-[#140d27]/60 to-transparent pointer-events-none text-left">
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-[#f54b37]/25 border border-[#f54b37]/60 text-[10px] font-bold text-[#f54b37]">
                            ॐ
                          </div>
                          <span className="block truncate text-xs sm:text-sm font-semibold text-white drop-shadow-md">
                            {displayName(item)}
                          </span>
                        </div>
                        {item.location ? (
                          <p className="mt-0.5 pl-7 sm:pl-8 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-[#e6e2f8]/75 drop-shadow">
                            {item.location}
                          </p>
                        ) : (
                          <p className="mt-0.5 pl-7 sm:pl-8 text-[10px] sm:text-[11px] font-medium text-[#e6e2f8]/60 drop-shadow truncate">
                            Nadi Sudhi Seeker
                          </p>
                        )}
                      </div>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Side Navigation Arrows (Vertically centered beside the carousel) */}
        <button
          type="button"
          id="testimonial-prev-btn"
          onClick={handlePrev}
          aria-label="Previous testimonial"
          className="absolute top-1/2 left-3 sm:left-6 md:left-10 lg:left-12 z-30 flex h-11 w-11 sm:h-12 sm:w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#e6e2f8]/20 bg-[#140d27]/80 text-[#e6e2f8] backdrop-blur-md transition-all duration-300 hover:border-[#f54b37] hover:bg-[#f54b37] hover:text-white hover:scale-110 shadow-lg shadow-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f54b37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140d27]"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          id="testimonial-next-btn"
          onClick={handleNext}
          aria-label="Next testimonial"
          className="absolute top-1/2 right-3 sm:right-6 md:right-10 lg:right-12 z-30 flex h-11 w-11 sm:h-12 sm:w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#e6e2f8]/20 bg-[#140d27]/80 text-[#e6e2f8] backdrop-blur-md transition-all duration-300 hover:border-[#f54b37] hover:bg-[#f54b37] hover:text-white hover:scale-110 shadow-lg shadow-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f54b37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140d27]"
        >
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="shell relative z-10">
        {/* Counter and summary caption */}
        <div className="mt-6 flex min-h-[3.5rem] flex-col items-center justify-start text-center">
          <p className="text-micro font-bold tracking-[0.32em] text-[#f54b37] uppercase">
            {String(activeItemIndex + 1).padStart(2, '0')} / {String(SET_SIZE).padStart(2, '0')}
          </p>
          <p className="measure-tight mt-2 text-body-sm text-pretty text-[#e6e2f8]/75">
            {activeItem.summary}
          </p>
        </div>

        <p className="sr-only" aria-live="polite">
          Testimonial {activeItemIndex + 1} of {SET_SIZE}: {activeItem.sourceTitle}
        </p>

        {/* Pagination Dots with pill indicator for active */}
        <div className="mt-4 flex items-center justify-center gap-2.5">
          {VIDEO_TESTIMONIALS.map((item, index) => {
            const isActive = index === activeItemIndex;
            return (
              <button
                key={item.id}
                type="button"
                id={`testimonial-dot-${index + 1}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to testimonial ${index + 1} of ${SET_SIZE}`}
                aria-current={isActive ? 'true' : undefined}
                className={`h-2.5 cursor-pointer rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f54b37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140d27] ${
                  isActive
                    ? 'w-9 bg-[#f54b37] shadow-[0_0_12px_rgba(245,75,55,0.6)]'
                    : 'w-2.5 bg-[#e6e2f8]/25 hover:bg-[#e6e2f8]/50'
                }`}
              />
            );
          })}
        </div>
      </div>




    </section>
  );
};
