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

import { About3DStack } from "./About3DStack";

describe("About3DStack card surface", () => {
  it("does not place translucent haze layers over the cards", () => {
    const { container } = render(<About3DStack />);
    const aboutCss = readFileSync(
      resolve(process.cwd(), "src/styles/sections/about.css"),
      "utf8",
    );

    expect(container.querySelector(".about-3d-stack__card-grid")).toBeNull();
    expect(
      container.querySelector(".about-3d-stack__card > .about__card-noise"),
    ).toBeNull();
    expect(aboutCss).not.toMatch(/\.about-3d-stack__card::before\s*{/);
  });
});
