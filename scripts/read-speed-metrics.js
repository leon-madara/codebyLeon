// Paste into DevTools Console after a cold reload, before interacting with the page.
// Use the viewport/network/CPU profiles in docs/PERFORMANCE_REVIEW.md.
(async () => {
  const observations = {};
  const observers = ["largest-contentful-paint", "layout-shift", "longtask"].map((type) => {
    const observer = new PerformanceObserver((list) => {
      (observations[type] ??= []).push(...list.getEntries());
    });
    observer.observe({ type, buffered: true });
    return observer;
  });
  await new Promise((resolve) => setTimeout(resolve, 100));
  observers.forEach((observer) => observer.disconnect());

  let cls = 0;
  let sessionValue = 0;
  let sessionStart = 0;
  let previousShift = 0;
  for (const shift of observations["layout-shift"] ?? []) {
    if (shift.hadRecentInput) continue;
    if (sessionValue > 0 && shift.startTime - previousShift < 1000 && shift.startTime - sessionStart < 5000) {
      sessionValue += shift.value;
    } else {
      sessionStart = shift.startTime;
      sessionValue = shift.value;
    }
    previousShift = shift.startTime;
    cls = Math.max(cls, sessionValue);
  }

  const navigation = performance.getEntriesByType("navigation")[0];
  const resources = performance.getEntriesByType("resource");
  const lcp = observations["largest-contentful-paint"]?.at(-1);
  const result = {
    url: location.href,
    observedAtMs: Math.round(performance.now()),
    viewport: `${innerWidth}x${innerHeight}@${devicePixelRatio}`,
    ttfbMs: Math.round(navigation?.responseStart ?? 0),
    fcpMs: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null,
    lcpMs: lcp?.startTime ?? null,
    lcpElement: lcp?.element?.tagName ?? null,
    cls,
    loadCompleted: Boolean(navigation?.loadEventEnd),
    fonts: document.fonts.status,
    readerOpen: Boolean(document.querySelector('[role="dialog"]')),
    completedTransferBytes: (navigation?.transferSize ?? 0) + resources.reduce((sum, item) => sum + item.transferSize, 0),
    longTasks: (observations.longtask ?? []).map(({ startTime, duration }) => ({ startTime, duration })),
    resources: resources.map(({ name, transferSize, encodedBodySize, duration }) => ({ name, transferSize, encodedBodySize, duration })),
  };
  console.table(Object.fromEntries(Object.entries(result).filter(([key]) => !["resources", "longTasks"].includes(key))));
  return result;
})();
