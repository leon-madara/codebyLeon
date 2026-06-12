import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

import {
  About3DStack,
  getAboutStackLayerOffset,
  getAboutStackMotionPlan,
  getAboutStackPinDistance,
} from "./About3DStack";

describe("About3DStack", () => {
  it("uses a balanced pin distance with the exit completed before release", () => {
    const motionPlan = getAboutStackMotionPlan();

    expect(motionPlan.totalDurationVh).toBe(480);
    expect(motionPlan.finalCardDwellVh).toBe(130);
    expect(motionPlan.animationCompleteVh).toBeLessThan(motionPlan.totalDurationVh);
    expect(motionPlan.totalDurationVh - motionPlan.animationCompleteVh).toBe(20);
    expect(getAboutStackPinDistance(1000)).toBe(4800);
    expect(getAboutStackPinDistance(900)).toBeCloseTo(4320);
  });

  it("keeps the decorative glow behind the card stack", () => {
    const { container } = render(<About3DStack />);

    const glow = container.querySelector(".about-3d-stack__background-glow");
    const cards = container.querySelector(".about-3d-stack__stack");

    expect(glow).toBeNull();
    expect(cards).not.toBeNull();
    expect(
      container.querySelector(".about-3d-stack__card .about-3d-stack__card-accent"),
    ).toBeNull();
  });

  it("keeps the halo in the static background instead of moving card shadows", () => {
    const aboutCss = readFileSync(
      resolve(process.cwd(), "src/styles/sections/about.css"),
      "utf8",
    );

    expect(aboutCss).not.toContain("--about-stack-card-shadow");
    expect(aboutCss).toMatch(
      /\.about-3d-stack__card\s*{[^}]*box-shadow:\s*0 24px 70px rgba\(15, 23, 42, 0\.18\)/s,
    );
  });

  it("keeps the glow below the dotted overlay and card content", () => {
    const { container } = render(<About3DStack />);
    const aboutCss = readFileSync(
      resolve(process.cwd(), "src/styles/sections/about.css"),
      "utf8",
    );

    expect(container.querySelector(".about-3d-stack__content-layer")).not.toBeNull();
    expect(aboutCss).toMatch(/\.about\s*{[^}]*isolation:\s*isolate/s);
    expect(aboutCss).toMatch(/\.about__orbs\s*{[^}]*z-index:\s*0/s);
    expect(aboutCss).toMatch(/\.about__overlay--3d\s*{[^}]*z-index:\s*1/s);
    expect(aboutCss).toMatch(
      /\.about-3d-stack__content-layer\s*{[^}]*z-index:\s*2/s,
    );
    const dottedOverlayRule = aboutCss.match(
      /\.about__overlay--3d\s*{([^}]*)}/s,
    )?.[1];

    expect(dottedOverlayRule).toBeDefined();
    expect(dottedOverlayRule).not.toContain("backdrop-filter");
  });

  it("keeps the card surfaces free of translucent haze layers", () => {
    const { container } = render(<About3DStack />);
    const aboutCss = readFileSync(
      resolve(process.cwd(), "src/styles/sections/about.css"),
      "utf8",
    );

    expect(
      container.querySelector(".about-3d-stack__card-grid"),
    ).toBeNull();
    expect(
      container.querySelector(".about-3d-stack__card > .about__card-noise"),
    ).toBeNull();
    expect(aboutCss).not.toMatch(/\.about-3d-stack__card::before\s*{/);
  });

  it("keeps queued cards vertically anchored while the active card exits", () => {
    expect(getAboutStackLayerOffset(0)).toBe(0);
    expect(getAboutStackLayerOffset(1)).toBe(0);
    expect(getAboutStackLayerOffset(2)).toBe(0);
  });
});
