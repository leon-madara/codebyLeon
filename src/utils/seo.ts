import { useEffect } from 'react';

export const SITE_URL = 'https://codebyleon.com';
export const SITE_NAME = 'Code by Leon';
export const DEFAULT_TITLE = 'Code by Leon | Nairobi Web Design Studio for Kenyan Businesses';
export const DEFAULT_DESCRIPTION =
  'Code by Leon builds fast, polished websites and brand experiences for Kenyan businesses that want more trust, inquiries, and growth online.';
export const DEFAULT_IMAGE = '/portfolio-legit.png';
export const DEFAULT_IMAGE_ALT = 'Code by Leon portfolio website preview';

export type SeoType = 'website' | 'article';

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  type?: SeoType;
  image?: string;
  imageAlt?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  structuredData?: Record<string, unknown>;
}

export function getAbsoluteUrl(path: string = '/'): string {
  return new URL(path || '/', SITE_URL).toString();
}

function setMetaAttribute(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
  tag.setAttribute('data-seo-managed', 'true');
}

function setCanonical(href: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', href);
  canonical.setAttribute('data-seo-managed', 'true');
}

function setJsonLd(data?: Record<string, unknown>) {
  const existing = document.head.querySelector<HTMLScriptElement>(
    'script[type="application/ld+json"][data-seo-managed="true"]'
  );

  if (!data) {
    existing?.remove();
    return;
  }

  const script = existing ?? document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo-managed', 'true');
  script.textContent = JSON.stringify(data);

  if (!existing) {
    document.head.appendChild(script);
  }
}

function removeArticleMeta() {
  document.head
    .querySelectorAll<HTMLMetaElement>('meta[property^="article:"][data-seo-managed="true"]')
    .forEach((tag) => tag.remove());
}

export function applyPageSeo(page: PageSeo) {
  const canonicalUrl = getAbsoluteUrl(page.path);
  const imageUrl = getAbsoluteUrl(page.image || DEFAULT_IMAGE);
  const imageAlt = page.imageAlt || DEFAULT_IMAGE_ALT;
  const pageType = page.type || 'website';

  document.title = page.title;

  setMetaAttribute('name', 'description', page.description);
  setMetaAttribute('name', 'robots', 'index, follow');
  setCanonical(canonicalUrl);

  setMetaAttribute('property', 'og:type', pageType);
  setMetaAttribute('property', 'og:title', page.title);
  setMetaAttribute('property', 'og:description', page.description);
  setMetaAttribute('property', 'og:url', canonicalUrl);
  setMetaAttribute('property', 'og:site_name', SITE_NAME);
  setMetaAttribute('property', 'og:image', imageUrl);
  setMetaAttribute('property', 'og:image:alt', imageAlt);
  setMetaAttribute('property', 'og:locale', 'en_KE');

  setMetaAttribute('name', 'twitter:card', 'summary_large_image');
  setMetaAttribute('name', 'twitter:title', page.title);
  setMetaAttribute('name', 'twitter:description', page.description);
  setMetaAttribute('name', 'twitter:image', imageUrl);
  setMetaAttribute('name', 'twitter:image:alt', imageAlt);

  removeArticleMeta();
  if (pageType === 'article') {
    if (page.author) setMetaAttribute('property', 'article:author', page.author);
    if (page.publishedTime) setMetaAttribute('property', 'article:published_time', page.publishedTime);
    if (page.modifiedTime) setMetaAttribute('property', 'article:modified_time', page.modifiedTime);
    if (page.section) setMetaAttribute('property', 'article:section', page.section);
    if (page.tags?.length) setMetaAttribute('property', 'article:tag', page.tags.join(', '));
  }

  setJsonLd(page.structuredData);
}

export function usePageSeo(page: PageSeo) {
  const tagsKey = page.tags?.join('|') || '';
  const schemaKey = page.structuredData ? JSON.stringify(page.structuredData) : '';

  useEffect(() => {
    applyPageSeo(page);
  }, [
    page.title,
    page.description,
    page.path,
    page.type,
    page.image,
    page.imageAlt,
    page.author,
    page.publishedTime,
    page.modifiedTime,
    page.section,
    tagsKey,
    schemaKey,
  ]);
}
