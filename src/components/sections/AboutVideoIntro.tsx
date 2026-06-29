import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AboutVideoIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 0.5;
      setIsMuted(nextMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setCurrentTime(cur);
      setProgressPercent((cur / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.volume = 0.5;
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (progressTrackRef.current && videoRef.current) {
      const rect = progressTrackRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      videoRef.current.currentTime = pct * videoRef.current.duration;
    }
  };

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 900px)", () => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=10vh",
        pin: true,
        pinSpacing: true,
        snap: {
          snapTo: 1,
          duration: 0.4,
          ease: "power1.inOut",
        },
        invalidateOnRefresh: true,
        onSnapComplete: () => {
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        },
        onEnter: () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        },
        onLeaveBack: () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        },
      });
    });

    mm.add("(max-width: 899px)", () => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        onEnter: () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        },
        onEnterBack: () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        },
        onLeave: () => {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        },
      });
    });

    return () => {
      mm.revert();
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="about-intro"
      className="about-video-intro"
    >
      <div className="about-video-intro__container px-6 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        <h1 className="about-video-intro__headline">
          Helping Kenyan Businesses{" "}
          <em>Look Professional Online</em>
        </h1>

        <div 
          className="about-video-intro__video-wrapper"
          onClick={togglePlay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              togglePlay();
            }
          }}
          aria-label="Toggle video playback"
        >
          <video
            ref={videoRef}
            src="/videos/codebyleon-intro.mp4"
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            className="about-video-intro__video"
            aria-label="A message from CodeByLeon founder, Leon Madara"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Center Large Play Icon Overlay when Paused */}
          {!isPlaying && (
            <div className="about-video-intro__center-play" aria-hidden="true">
              <span>▶</span>
            </div>
          )}

          {/* Glassmorphic Control Bar Overlay */}
          <div 
            className="about-video-intro__controls-bar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Play/Pause Toggle */}
            <button
              type="button"
              onClick={togglePlay}
              className="about-video-intro__control-btn"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>

            {/* Live Progress Bar & Scrub Track */}
            <div 
              ref={progressTrackRef}
              className="about-video-intro__progress-track"
              onClick={handleScrub}
              role="slider"
              aria-label="Video seek progress"
              aria-valuenow={Math.round(progressPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div 
                className="about-video-intro__progress-fill" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>

            {/* Time Counter */}
            <span className="about-video-intro__time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Audio Volume Mute Button */}
            <button
              type="button"
              onClick={toggleMute}
              className="about-video-intro__control-btn about-video-intro__control-btn--audio"
              aria-label={isMuted ? "Unmute video at 50% volume" : "Mute video"}
            >
              <span>{isMuted ? "🔇" : "🔊"}</span>
            </button>
          </div>
        </div>

        <p className="about-video-intro__subheadline">
          <strong>A message from CodeByLeon founder – Leon Madara.</strong><br />
          I design websites and visuals that help Kenyan businesses look
          professional, get more inquiries, and build trust online.
        </p>
      </div>
    </section>
  );
}
