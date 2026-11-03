"use client";

import { useEffect, useRef, useState } from "react";

import {
  Clapperboard,
  Code2,
  Gauge,
  Layers,
  LineChart,
  RefreshCw,
  Smartphone,
  UserCheck,
  Zap,
} from "lucide-react";

const CAPABILITIES = [
  { icon: Code2, label: "Custom Websites" },
  { icon: Zap, label: "Page Speed Checks" },
  { icon: Layers, label: "Website Design" },
  { icon: Smartphone, label: "Layouts for Phones and Desktops" },
  { icon: LineChart, label: "Search Setup & Visitor Reports" },
  { icon: Gauge, label: "Clear Enquiry Forms" },
  { icon: RefreshCw, label: "Website Moves" },
  { icon: Clapperboard, label: "Website Animations" },
  { icon: UserCheck, label: "Work Directly with Leon" },
];

export function CapabilityTicker({ className = "" }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const measurement = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(1);
  const [slots, setSlots] = useState<number[]>([0]);
  const [fading, setFading] = useState<number | null>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const fit = () => {
      const widths = Array.from(measurement.current?.children ?? [], child => child.getBoundingClientRect().width);
      const slotWidth = Math.max(1, ...widths) + 1;
      setCount(Math.min(CAPABILITIES.length, Math.max(1, Math.floor(element.clientWidth / slotWidth))));
    };
    const observer = new ResizeObserver(fit);
    let active = true;
    void document.fonts.ready.then(() => { if (active) fit(); });
    observer.observe(element);
    return () => { active = false; observer.disconnect(); };
  }, []);

  useEffect(() => {
    let visible = Array.from({ length: count }, (_, index) => index);
    let remaining = CAPABILITIES.map((_, index) => index).filter(index => !visible.includes(index));
    let swap: ReturnType<typeof setTimeout>;
    let reveal: ReturnType<typeof setTimeout>;
    // Schedule the reset outside the effect's synchronous render path.
    const reset = setTimeout(() => {
      setSlots(visible);
      setFading(null);
    }, 0);
    if (count === CAPABILITIES.length) return () => clearTimeout(reset);
    const interval = setInterval(() => {
      const slot = Math.floor(Math.random() * count);
      setFading(slot);
      swap = setTimeout(() => {
        if (remaining.length === 0) {
          remaining = CAPABILITIES.map((_, index) => index).filter(index => !visible.includes(index));
        }
        const pick = Math.floor(Math.random() * remaining.length);
        const [replacement] = remaining.splice(pick, 1);
        visible = visible.map((value, index) => index === slot ? replacement : value);
        setSlots(visible);
        reveal = setTimeout(() => setFading(null), 40);
      }, 420);
    }, 3000);
    return () => {
      clearTimeout(reset);
      clearInterval(interval);
      clearTimeout(swap);
      clearTimeout(reveal);
    };
  }, [count]);

  return (
    <div ref={container} className={`relative mx-4 ${className}`}>
      <div aria-hidden className="pointer-events-none invisible absolute h-0 w-0 overflow-hidden">
      <div ref={measurement} className="flex w-max">
        {CAPABILITIES.map(cap => (
          <span key={cap.label} className="flex items-center gap-2 whitespace-nowrap px-3 font-mono text-[11px] uppercase tracking-[0.1em]">
            <cap.icon className="size-3.5 shrink-0" />{cap.label}
          </span>
        ))}
      </div>
      </div>
      <ul className="sr-only" aria-label="Studio capabilities">
        {CAPABILITIES.map(({ label }) => <li key={label}>{label}</li>)}
      </ul>
      <div aria-hidden className="flex h-14 items-center">
        {slots.map((capability, index) => {
          const cap = CAPABILITIES[capability];
          return (
            <div key={index} className={`flex h-6 min-w-0 flex-1 items-center justify-center px-3 ${index > 0 ? "border-l border-signal/60" : ""}`}>
              <span
                className={`flex items-center justify-center gap-2 whitespace-nowrap font-mono text-[11px] uppercase leading-[1.4] tracking-[0.1em] text-muted-foreground transition-[opacity,transform] duration-[400ms] ease-in-out motion-reduce:transition-none ${fading === index ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
              >
                <cap.icon className="size-3.5 shrink-0 text-signal" />
                <span>{cap.label}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
