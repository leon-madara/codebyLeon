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

  it("renders the card stack on a plain section background", () => {
    const { container } = render(<About3DStack />);

    const cards = container.querySelector(".about-3d-stack__stack");

    expect(cards).not.toBeNull();
    expect(container.querySelector(".about__orbs")).toBeNull();
    expect(container.querySelector(".about__overlay--3d")).toBeNull();
    expect(container.querySelector(".about-3d-stack__background-glow")).toBeNull();
    expect(
      container.querySelector(".about-3d-stack__card .about-3d-stack__card-accent"),
    ).toBeNull();
  });

  it("does not define a dotted or translucent overlay for the 3D stack", () => {
    const aboutCss = readFileSync(
      resolve(process.cwd(), "src/styles/sections/about.css"),
      "utf8",
    );

    expect(aboutCss).not.toMatch(/\.about__overlay--3d\s*{/);
    expect(aboutCss).not.toMatch(/\.about-3d-stack__background-glow\s*{/);
    expect(aboutCss).not.toMatch(/\.about-3d-stack__orb(?:--[a-z]+)?\s*{/);
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
