import { HomeContent } from "@/components/home/home-page";
import type { Metadata } from "next";
import { LegacyAnchors } from "@/components/home/legacy-anchors";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL("https://codebyleon.com"),
  alternates: { canonical: "https://codebyleon.com/" },
};

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/images/codebyleon-logo.png`, width: 512, height: 512 }, description: SITE_DESCRIPTION },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, alternateName: "CodeByLeon", url: SITE_URL, publisher: { "@id": `${SITE_URL}/#organization` } },
    ],
  };
  return <>
    <link rel="preload" href="/fonts/original-hero/handwritten.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/original-hero/quikhand.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/original-hero/candy.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <HomeContent /><LegacyAnchors />
  </>;
}
