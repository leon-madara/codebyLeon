import type { Metadata } from "next";

export const SITE_URL = "https://codebyleon.com";
export const SITE_NAME = "Code by Leon";
export const SITE_DESCRIPTION = "Custom websites, website redesigns, and online tools for your business. Work directly with Leon in Nairobi, Kenya.";

export function socialMetadata(title: string, description: string, path: string, image = "/images/codebyleon-share.png"): Pick<Metadata, "openGraph" | "twitter"> {
  const images = [{ url: `${SITE_URL}${image}`, alt: image === "/images/codebyleon-share.png" ? "Code by Leon logo" : title,
    ...(image === "/images/codebyleon-share.png" ? { width: 1200, height: 630, type: "image/png" } : {}) }];
  return {
    openGraph: { title, description, url: `${SITE_URL}${path}`, siteName: SITE_NAME, locale: "en_KE", type: "website", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
