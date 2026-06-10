import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PhoneCall, PenTool, Code, Rocket, Handshake } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: <PhoneCall className="w-5 h-5 text-brand-canvas" />,
    title: "Discovery call",
    description: "A free 30-minute call. You talk, I listen. We map the real problem before talking pixels or pricing.",
    step: "01"
  },
  {
    icon: <PenTool className="w-5 h-5 text-brand-canvas" />,
    title: "Design & direction",
    description: "Wireframes, moodboards, and a clear creative direction. You sign off before a single line of production code is written.",
    step: "02"
  },
  {
    icon: <Code className="w-5 h-5 text-brand-canvas" />,
    title: "Build",
    description: "I ship in tight, daily increments. You get a private preview link and updates you can actually understand.",
    step: "03"
  },
  {
    icon: <Rocket className="w-5 h-5 text-brand-canvas" />,
    title: "Launch",
    description: "Domain, analytics, SEO basics, the works. We go live together — no mystery, no panic.",
    step: "04"
  },
  {
    icon: <Handshake className="w-5 h-5 text-brand-canvas" />,
    title: "Aftercare",
    description: "Two weeks of free tweaks, then optional retainer. Your project keeps moving, you keep your sanity.",
    step: "05"
  }
];

export function ProcessPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    // Hero stagger
    gsap.fromTo('.process-hero-text > *', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
    
    // Timeline Rail Animation
    if (railRef.current) {
      gsap.fromTo(railRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 50%',
            end: 'bottom 80%',
            scrub: true,
          }
        }
      );
    }
    
    // Step Cards Reveal Animation
    gsap.utils.toArray('.process-step').forEach((step: any, i) => {
      gsap.fromTo(step,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-brand-canvas text-brand-navy font-body overflow-x-hidden relative">
      
      {/* --- BACKGROUND ORBS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="hero__bg-wrapper absolute inset-0 z-0 scale-110 origin-center will-change-transform">
          <div className="hero__orbs-container">
            <div className="hero__orb hero__orb--purple"></div>
            <div className="hero__orb hero__orb--orange"></div>
            <div className="hero__orb hero__orb--blue"></div>
          </div>
          <div className="hero__frosted-overlay"></div>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto text-center relative z-10">
        {/* Ember glow behind the header */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-ember rounded-full blur-[100px] opacity-40 -z-10 pointer-events-none" />
        
        <header className="process-hero-text">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-transparent border border-[#E2E8F0] text-xs font-bold tracking-widest text-[#94A3B8] mb-8 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-ember"></span>
            The Process
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display tracking-tight mb-8 leading-tight">
            A transparent, <br className="hidden md:block"/>
            <span className="text-brand-ember">zero-friction</span> process.
          </h1>
          
          <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            No mystery contracts. No vanity decks. Five honest steps from our first call to your launch day — and the two weeks after.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                const timeline = document.querySelector('.timeline-container');
                timeline?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full bg-[#111827] text-white font-medium flex items-center gap-2 hover:bg-[#1F2937] transition-colors"
            >
              See the five steps
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link 
              to="/" 
              className="px-6 py-3 rounded-full bg-transparent border border-[#E2E8F0] text-[#111827] font-medium hover:bg-black/5 transition-colors"
            >
              Book a discovery call
            </Link>
          </div>
        </header>
      </main>

      {/* --- TIMELINE SECTION --- */}
      <section className="timeline-container py-24 relative max-w-5xl mx-auto px-6 md:px-12">
        {/* Center Rail (Desktop) */}
        <div 
          ref={railRef}
          className="absolute left-[24px] md:left-1/2 top-24 bottom-24 w-0.5 timeline-rail hidden md:block origin-top -translate-x-1/2 z-0"
        />

        <div className="space-y-16 md:space-y-24 relative z-10">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`process-step flex flex-col md:flex-row items-center gap-8 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Mobile Icon (hidden on desktop) */}
                <div className="md:hidden self-start flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-full bg-brand-emerald flex items-center justify-center shadow-lg">
                      {step.icon}
                   </div>
                   <span className="text-sm font-bold tracking-widest text-brand-emerald uppercase">Step {step.step}</span>
                </div>

                {/* Left/Right content side */}
                <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-16 lg:pr-24 text-left md:text-right' : 'md:pl-16 lg:pl-24 text-left'}`}>
                  <div className={`bg-white p-8 md:p-10 rounded-3xl shadow-soft border border-[#F1F5F9] ${isEven ? 'ml-auto' : 'mr-auto'} max-w-md w-full relative`}>
                    <div className="hidden md:block text-sm font-bold tracking-widest text-brand-emerald mb-3 uppercase">
                      Step {step.step}
                    </div>
                    <h3 className="text-2xl font-display mb-4 text-brand-navy">{step.title}</h3>
                    <p className="text-[#64748B] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center Hovering Icon (Desktop) */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-brand-emerald items-center justify-center shadow-glow-ember ring-4 ring-brand-canvas transition-transform hover:scale-110">
                  {step.icon}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-6 relative overflow-hidden text-center">
         <div className="absolute inset-0 glow-ember opacity-60 pointer-events-none" />
         
         <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-display mb-6 text-brand-navy tracking-tight">Ready to start step one?</h2>
            <p className="text-[#64748B] text-lg md:text-xl mb-10 leading-relaxed">
              Book a free discovery call today. Thirty minutes, zero pressure — you'll leave with a clearer plan whether we work together or not.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/" 
                className="px-6 py-3 rounded-full bg-brand-ember text-white font-medium flex items-center gap-2 hover:bg-[#EA580C] transition-colors shadow-glow-ember"
              >
                Book a discovery call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/" 
                className="px-6 py-3 rounded-full bg-white border border-[#E2E8F0] text-brand-navy font-medium hover:bg-gray-50 transition-colors"
              >
                Back to home
              </Link>
            </div>
            
            <p className="mt-16 text-sm text-[#94A3B8]">
              © {new Date().getFullYear()} Code by Leon — built transparently.
            </p>
         </div>
      </section>
    </div>
  );
}
