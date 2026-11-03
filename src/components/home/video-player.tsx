"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Maximize2, Minimize2, Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import "./video-player.css";

interface Chapter {
  time: number;
  label: string;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  chapters?: Chapter[];
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ src, poster, className, chapters = [] }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shellRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // keep element volume in sync with state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.muted = muted;
  }, [volume, muted]);

  // metadata may already be loaded before hydration attaches the JSX handler —
  // sync it on mount and listen for the event as well.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const syncMeta = () => {
      if (Number.isFinite(v.duration) && v.duration > 0) {
        setDuration(v.duration);
        setReady(true);
      }
    };
    if (v.readyState >= 1) syncMeta();
    v.addEventListener("loadedmetadata", syncMeta);
    return () => v.removeEventListener("loadedmetadata", syncMeta);
  }, []);

  // track fullscreen state
  useEffect(() => {
    const onFsChange = () => setFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) {
      v.play().catch(() => {
        /* playback interrupted — user can retry */
      });
    } else {
      v.pause();
    }
  }, []);

  const onSeek = (value: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(value)) return;
    v.currentTime = Math.min(Math.max(value, 0), v.duration || 0);
    setCurrent(v.currentTime);
  };

  const skip = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    onSeek(v.currentTime + delta);
  };

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (!next && volume === 0) setVolume(0.5);
      return next;
    });
  };

  const onVolumeChange = (value: number) => {
    setVolume(value);
    if (value > 0) setMuted(false);
  };

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement === shellRef.current) {
      document.exitFullscreen().catch(() => undefined);
    } else {
      shellRef.current?.requestFullscreen?.().catch(() => undefined);
    }
  }, []);

  // keyboard shortcuts on the player shell (space/k, arrows, m, f)
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "BUTTON") return; // native controls handle their own keys

    switch (e.key.toLowerCase()) {
      case " ":
      case "k":
        e.preventDefault();
        togglePlay();
        break;
      case "arrowleft":
        e.preventDefault();
        skip(-5);
        break;
      case "arrowright":
        e.preventDefault();
        skip(5);
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        toggleFullscreen();
        break;
      default:
        break;
    }
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;
  const activeChapter = chapters.reduce<number>(
    (acc, ch, i) => (current >= ch.time ? i : acc),
    -1
  );

  return (
    <figure
      ref={shellRef}
      tabIndex={0}
      role="group"
      aria-label="Video player — use space to play or pause, arrow keys to seek, M to mute, F for fullscreen"
      onKeyDown={onKeyDown}
      className={cn("video-shell", className)}
    >
      <div className="video-stage">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="none"
          playsInline
          aria-label="My message to you — Leon Madara"
          onClick={togglePlay}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration);
            setReady(true);
          }}
        />
        {!playing && (
          <button type="button" onClick={togglePlay} aria-label="Play founder introduction video" className="video-play-overlay">
            <span className="video-center-play"><Play size={24} fill="currentColor" strokeWidth={0} aria-hidden /></span>
          </button>
        )}
        <div className="video-controls">
          <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="video-control-button">
            {playing ? <Pause size={16} fill="currentColor" aria-hidden /> : <Play size={16} fill="currentColor" strokeWidth={0} aria-hidden />}
          </button>
          <div className="video-seek" style={{ "--video-progress": `${progress}%` } as CSSProperties}>
            <div className="video-progress-track" aria-hidden><div className="video-progress-fill" /></div>
            {chapters.map((ch) => duration > 0 ? (
              <span key={ch.label} className="video-chapter-tick" aria-hidden style={{ left: `${ch.time / duration * 100}%` }} />
            ) : null)}
            <input type="range" min={0} max={duration || 0} step={0.1} value={current}
              disabled={!ready || duration === 0} onChange={(e) => onSeek(Number(e.target.value))}
              aria-label="Seek video" aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`} className="video-seek-input" />
          </div>
          <span className="video-time" aria-label={`Elapsed time ${formatTime(current)} of ${formatTime(duration)}`}>
            {formatTime(current)} / {formatTime(duration)}
          </span>
          <div className="video-volume-group">
            <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="video-control-button">
              {muted || volume === 0 ? <VolumeX size={16} aria-hidden /> : volume < .5 ? <Volume1 size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
            </button>
            <div className="video-volume-popover">
              <input type="range" min={0} max={1} step={.05} value={muted ? 0 : volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))} aria-label="Adjust volume" className="video-volume-input" />
            </div>
          </div>
          <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"} className="video-control-button">
            {fullscreen ? <Minimize2 size={15} aria-hidden /> : <Maximize2 size={15} aria-hidden />}
          </button>
        </div>
      </div>
      {chapters.length > 0 ? (
        <div className="video-chapters">
          {chapters.map((ch, i) => (
            <button key={ch.label} type="button" onClick={() => onSeek(ch.time)} aria-current={activeChapter === i ? "true" : undefined}>
              {formatTime(ch.time)} {ch.label}
            </button>
          ))}
        </div>
      ) : null}
    </figure>
  );
}
