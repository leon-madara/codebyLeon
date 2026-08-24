/**
 * Routes where smart navigation scroll behavior should run.
 * Multi-section experiences only — not single-section reading pages.
 */
export function isMultiSectionRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  if (pathname === '/process') return true;
  if (pathname === '/blog') return true;
  if (pathname.startsWith('/work/')) return true;
  return false;
}

export const SMART_NAV_SHOW_AFTER_STOP_MS = 2000;
export const SMART_NAV_HIDE_AFTER_IDLE_MS = 3000;
export const SMART_NAV_TABLET_MIN_WIDTH = 768;
