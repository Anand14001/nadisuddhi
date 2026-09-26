export interface TrustBadge {
  id: string;
  title: string;
  subtitle?: string;
  iconName: string;
}

export interface JourneyStep {
  number: number;
  title: string;
  phase: 'cleansing' | 'awakening';
  summary: string;
  detail: string;
  keyAction: string;
  iconName: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AdvisorDetail {
  name: string;
  role: string;
  lineage: string;
  origin: string;
  pioneeringAchievement: string;
  globalReach: string[];
}

export type TestimonialFormat = 'landscape' | 'portrait';

export type VideoType = 'youtube' | 'mp4';

export interface VideoTestimonial {
  id: string;
  type: VideoType;
  videoId?: string;
  src?: string;
  posterUrl?: string;
  /** Drives the frame's aspect ratio and which poster variant is requested. */
  format: TestimonialFormat;
  /** Verbatim title of the source upload. Used for alt text and the iframe title. */
  sourceTitle: string;
  /** Display line. Always a literal substring of sourceTitle — never a rewrite. */
  summary: string;
  /** Only set when the source upload names the speaker. */
  person: string | null;
  /** Only set when the source upload names a place. */
  location: string | null;
  /** Seconds to skip on play, when the source link carries an offset. */
  startAt?: number;
}

export interface TestimonialImage {
  id: string;
  /** Cloudinary version + filename, exactly as supplied. */
  assetPath: string;
  /** Intrinsic pixels, so the browser can reserve the box before the file lands. */
  width: number;
  height: number;
}
