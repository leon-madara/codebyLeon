import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Blog background layers", () => {
  it("keeps fixed blog-post orbs scoped away from homepage sections", () => {
    const blogCss = readFileSync(
      resolve(process.cwd(), "src/styles/sections/blog.css"),
      "utf8",
    );
    const blogPostCss = readFileSync(
      resolve(process.cwd(), "src/styles/sections/blog-post.css"),
      "utf8",
    );

    expect(blogCss).toMatch(
      /\.blog__orbs\s*{[^}]*position:\s*absolute/s,
    );
    expect(blogPostCss).not.toMatch(/(?:^|\n)\.blog__orbs\s*{/);
    expect(blogPostCss).not.toMatch(/(?:^|\n)\.blog__orb\s*{/);
    expect(blogPostCss).toMatch(
      /\.blog-post-page-wrapper\s+\.blog__orbs\s*{[^}]*position:\s*fixed/s,
    );
    expect(blogPostCss).toMatch(
      /\.blog-post-page-wrapper\s+\.blog__orb\s*{[^}]*filter:\s*blur\(120px\)/s,
    );
  });
});
