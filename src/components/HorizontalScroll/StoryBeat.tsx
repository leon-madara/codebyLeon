import { ReactNode, forwardRef } from 'react';
import projectCreative from '@/assets/project-creative.jpg';
import projectFintech from '@/assets/project-fintech.jpg';
import projectLogistics from '@/assets/project-logistics.jpg';
import projectRestaurant from '@/assets/project-restaurant.jpg';
import projectSaas from '@/assets/project-saas.jpg';

interface StoryBeatProps {
  index: number;
  title: string;
  subtitle?: string;
  description: string;
  icon: ReactNode;
  children?: ReactNode;
  gradientClass: string; 
}

interface BeatMediaConfig {
  src: string;
  alt: string;
  label: string;
}

const DEFAULT_MEDIA: BeatMediaConfig = {
  src: projectCreative,
  alt: 'Creative web project preview',
  label: 'Editorial Build',
};

const BEAT_MEDIA: Record<string, BeatMediaConfig> = {
  'card1-beat-1': {
    src: projectLogistics,
    alt: 'Logistics platform interface preview',
    label: 'Visibility Gap',
  },
  'card1-beat-2': {
    src: projectRestaurant,
    alt: 'Restaurant platform branding preview',
    label: 'Planning Sprint',
  },
  'card1-beat-3': {
    src: projectSaas,
    alt: 'SaaS dashboard development preview',
    label: 'Build Phase',
  },
  'card1-beat-4': {
    src: projectCreative,
    alt: 'Creative website launch preview',
    label: 'Launch Ready',
  },
  'card2-beat-1': {
    src: projectFintech,
    alt: 'Fintech product with dated brand cues',
    label: 'Brand Audit',
  },
  'card2-beat-2': {
    src: projectCreative,
    alt: 'Creative direction board and strategy',
    label: 'Strategy Mapping',
  },
  'card2-beat-3': {
    src: projectLogistics,
    alt: 'Design process and system overhaul preview',
    label: 'Process Execution',
  },
  'card2-beat-4': {
    src: projectSaas,
    alt: 'Polished transformed brand interface',
    label: 'Transformation',
  },
  'card3-beat-1': {
    src: projectRestaurant,
    alt: 'Campaign pipeline showing bottlenecks',
    label: 'Capacity Pressure',
  },
  'card3-beat-2': {
    src: projectFintech,
    alt: 'Retainer support model planning board',
    label: 'Retainer Model',
  },
  'card3-beat-3': {
    src: projectCreative,
    alt: 'Workflow dashboard for ongoing requests',
    label: 'Workflow System',
  },
  'card3-beat-4': {
    src: projectLogistics,
    alt: 'Growth metrics and support outcomes',
    label: 'Success Metrics',
  },
};

const StoryBeat = forwardRef<HTMLDivElement, StoryBeatProps>(
  ({ index, title, subtitle, description, icon, children, gradientClass }, ref) => {
    const media = BEAT_MEDIA[gradientClass] ?? DEFAULT_MEDIA;

    return (
      <article
        ref={ref}
        className={`hs-beat ${gradientClass}`.trim()}
        data-beat={index}
      >
        <div className="hs-beat__shell">
          <figure className="hs-beat__media hs-beat-reveal">
            <img
              src={media.src}
              alt={media.alt}
              className="hs-beat__media-image"
              loading="lazy"
              decoding="async"
            />
            <div className="hs-beat__media-overlay" />
            <figcaption className="hs-beat__media-label">{media.label}</figcaption>
          </figure>

          <div className="hs-beat__content">
            <div className="hs-beat__content-inner">
              <p className="hs-beat__eyebrow hs-beat-reveal">Step {index + 1}</p>

              <div className="hs-beat__icon hs-beat-reveal">
                <div className="hs-beat__icon-inner">{icon}</div>
              </div>

              <h2 className="hs-beat__title hs-beat-reveal">{title}</h2>

              {subtitle && (
                <p className="hs-beat__subtitle hs-beat-reveal">{subtitle}</p>
              )}

              <p className="hs-beat__description hs-beat-reveal">{description}</p>

              {children && (
                <div className="hs-beat__body hs-beat-reveal">
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }
);

StoryBeat.displayName = 'StoryBeat';

export default StoryBeat;
