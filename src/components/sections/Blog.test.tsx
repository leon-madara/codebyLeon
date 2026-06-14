import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Blog background layers", () => {
  it("keeps decorative orbs on blog discovery surfaces only", () => {
    const blogCss = readFileSync(
      resolve(process.cwd(), "src/styles/sections/blog.css"),
      "utf8",
    );
    const blogPostCss = readFileSync(
      resolve(process.cwd(), "src/styles/sections/blog-post.css"),
      "utf8",
    );
    const blogPostPage = readFileSync(
      resolve(process.cwd(), "src/pages/BlogPostPage.tsx"),
      "utf8",
    );

    expect(blogCss).toMatch(
      /\.blog__orbs\s*{[^}]*position:\s*absolute/s,
    );
    expect(blogPostPage).not.toContain('className="blog__orbs"');
    expect(blogPostPage).not.toContain('className="blog__overlay"');
    expect(blogPostPage).not.toContain("ORB_PALETTES");
    expect(blogPostCss).not.toMatch(/\.blog-post-page-wrapper\s+\.blog__orb/);
    expect(blogPostCss).not.toMatch(/\.blog-post-page-wrapper\s+\.blog__overlay/);
    expect(blogPostCss).toMatch(
      /\.blog-post-page-wrapper\s*{[^}]*background:\s*#FCFAF7/s,
    );
    expect(blogPostCss).toMatch(
      /--article-control-clearance:\s*clamp\(200px,\s*16vw,\s*224px\)/,
    );
    expect(blogPostCss).toMatch(
      /\.v1-main\s*{[^}]*padding-top:\s*var\(--article-control-clearance\)/s,
    );
  });
});
