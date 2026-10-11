"use client";

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

function Track({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {CAPABILITIES.map((cap) => (
        <span key={cap.label} className="flex items-center">
          <span className="flex items-center gap-2.5 px-7 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <cap.icon className="size-3.5 text-signal" aria-hidden />
            {cap.label}
          </span>
          <span
            aria-hidden
            className="size-1.5 rotate-45 bg-signal/60"
          />
        </span>
      ))}
    </div>
  );
}

export function CapabilityTicker() {
  return (
    <div
      className="marquee relative overflow-hidden border-y border-border bg-transparent py-4"
      aria-label="Studio capabilities"
    >
      {/* edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
      />
      <div className="marquee-track">
        <Track />
        <Track ariaHidden />
      </div>
    </div>
  );
}
