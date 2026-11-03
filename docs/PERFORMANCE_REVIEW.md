# Alternate website performance review — 20 October 2026

Speed improvements are implemented locally. Browser verification is **partial**: the user interrupted the final sweep and requested a scoped commit and report. No push or deployment was performed.

## What changed

- Converted ten existing display fonts to WOFF2, preserving the complete fonts and original files/licenses. Full WOFF2 versions total 408,956 bytes versus 2,116,204 bytes for their TTF/OTF sources, an 80.7% reduction.
- Added small subsets for the two fixed decorative headings: Nexa 24,596 bytes and Take Cover 14,552 bytes. They save another 193,088 bytes compared with their full WOFF2 faces. CSS retains the full same-family faces for future characters outside the subset ranges. No typography, wording, spacing or colours were changed by this task.
- Changed project/article covers, article thumbnails and work previews to Next Image with explicit dimensions and responsive sizes. Original pictures and existing crops remain in place.
- Set the founder video to `preload="none"`, so playback requests the video when the visitor chooses Play. The existing black opening frame and player controls are preserved.
- Suspended particle drawing when its canvas is offscreen or the document is hidden. Reduced motion displays one still frame, with updates for resize and theme changes.
- Added `scripts/optimize-fonts.py` for reproducible font generation/validation and `scripts/read-speed-metrics.js` for repeatable browser measurements.

## Measured results

These are local lab observations from the working checkout based on `1e896da9b77500a85dcd71c71b1397c26129adc3`, with existing uncommitted design work present. They are not measurements of the smaller isolated commit or a deployed website.

Completed startup resource transfers on the normal profile, excluding the HTML document and any incomplete/range media requests:

| URL | Before | Final | Reduction |
|---|---:|---:|---:|
| `/` | 1,109,333 B | 623,750 B | 43.8% |
| `/get-started.html` | 331,804 B | 331,804 B | unchanged |
| `/work` | 1,109,333 B | 623,750 B | 43.8% |
| `/work/kossy-langat` | 1,244,404 B | 631,250 B | 49.3% |
| `/work/delivah-dispatch-hub` | 1,257,184 B | 641,764 B | 49.0% |
| `/work/legit-logistics` | 1,206,305 B | 630,686 B | 47.7% |
| `/blog` | 1,109,333 B | 623,750 B | 43.8% |
| `/blog/3-mistakes-your-business-website-is-making` | 1,202,236 B | 633,540 B | 47.3% |
| `/blog/before-after-website-transformation-case-studies` | 1,233,199 B | 632,876 B | 48.7% |
| `/blog/how-professional-website-increases-inquiries` | 1,182,494 B | 631,592 B | 46.6% |

The Kossy cover transferred about 135 KB before and 7.5 KB after at the tested mobile size. Its slow-mobile observed LCP improved from 8.41 s to 6.58 s. Delivah's observed LCP improved from 10.46 s to 7.56 s. Homepage first content remained around 1.1 s on slow mobile; this task does not establish a consistent first-paint improvement.

The initial 2G baseline painted the homepage in about 3.9 s, while project/article dialogs remained unopened at the 20-second observation point. The first optimization round still showed this delay. **The final subset build has not completed its 2G comparison**, so there is no claim that the 2G problem is resolved.

The compact measurements and profile coverage are in `performance-results-2026-10-20.json`. Raw local observations and logs remain in ignored `.preview-speed/`. Some intermediate rounds are included there; use final subset samples rather than treating earlier optimization results as final.

## Test conditions and coverage

Browser: Chromium in the Codex browser, local Next.js 16.4.0 Webpack production build at `http://localhost:3115`. Browser HTTP cache disabled, 390 × 844 viewport, DPR 1, dark theme and normal motion for the performance matrix. Server-side image optimization cache was not cleared between runs. Connection used local HTTP/1.1; hosting, TLS, CDN, DNS and real mobile radios were not tested.

| Profile | Download / upload | Added latency | CPU slowdown | Observation |
|---|---|---:|---:|---|
| Normal | unrestricted | 0 ms | 1× | roughly 2–3 seconds after navigation |
| Slow mobile | 1.6 Mbps / 750 kbps | 150 ms | 4× | target 10 seconds from navigation |
| 2G stress profile | 250 kbps / 50 kbps | 800 ms | 4× | target 20 seconds from navigation |

The JSON stores actual observation times; occasional browser scheduling delays exceeded the target. These are defined lab profiles, not promises about every connection carrying those names. Each route/profile received one baseline observation rather than a statistically repeated benchmark.

- Before: all ten public URLs under all three profiles, 30 observations.
- First optimization round: all ten URLs on normal and slow mobile; one 2G project observation.
- Final subset build: all ten URLs on normal; five slow-mobile observations before interruption (homepage, intake, work index, Kossy and Delivah). No final 2G observations.
- The matrix covers the homepage's service/founder/work/article sections through its home route. Service presets, discovery-call query parameters and the 404 page are not separate speed samples.

LCP observations on reader routes can describe the background homepage before the dialog opens. Always check `readerOpen` alongside LCP. The original raw `metrics.cls` is an accumulated layout-shift value within the observation window, not the session-window Core Web Vital CLS. No Core Web Vitals pass, field INP result or Lighthouse/PageSpeed score is claimed. The repeatable console script calculates session-window CLS.

## Verification and remaining work

- Working-checkout production build passed after the final changes. Its Next configuration skips TypeScript build errors, so the build is not type-check proof.
- Focused ESLint passed for the five changed TypeScript components; whitespace and font/CSS validation passed.
- Full type-check still reports three errors in untouched code: missing `socket.io-client` and `socket.io` in the websocket examples, plus `configurator.tsx:384`. Those errors were documented before this task and remain outside this commit.
- Full-font table/glyph mapping preservation and subset outline/metric/OpenType shaping checks passed. An independent source review found no actionable regressions; browser checks remain distinct from that review.
- Mobile reduced-motion navigation to Reality Check landed at the header offset with no horizontal overflow. Canvas instrumentation observed zero ongoing draw calls in reduced motion.
- **Pending:** final 2G sweep, remaining five final slow-mobile samples, full desktop/mobile interaction checks, first-click video playback, offscreen/tab-hide particle suspension, and a browser check of future-character full-font fallback. Layout shifts under throttling also need a focused follow-up; reduced transfer alone does not prove stable rendering.
- The scoped commit candidate excludes the checkout's unrelated design/content changes. Focused lint and the production build passed on an isolated copy of that candidate. The first nested copy stalled; the separate scratch-workspace build completed. It emitted standalone tracing warnings because dependencies are linked outside that scratch folder, so standalone release packaging was not verified. Working-checkout browser numbers must not be presented as measurements of the isolated candidate.

The most useful next improvement is to finish the 2G reader check and trace the reader's time to open. If the delay remains material, reduce the JavaScript/content needed before a directly linked project or article becomes readable.

## Repeat the checks

1. Build with the documented Windows command: `node node_modules/next/dist/bin/next build --webpack`. Keep its required standalone packaging steps for an actual release. The local lab used `next start` for a temporary preview; Next emitted its standalone-output warning.
2. In DevTools, disable browser cache, apply the viewport and exact network/CPU profile above, and reload each public URL in the table. Keep motion and theme consistent.
3. Before interacting, run the contents of `scripts/read-speed-metrics.js` in Console at the observation point. Record actual time, FCP/LCP, load completion, reader visibility, transfer sizes and layout shifts. Do not compare an unfinished transfer to a completed load.
4. Repeat important measurements at least three times and compare medians before drawing timing conclusions. Then test menu/anchors, reader open/close, the intake including service presets, video first-play/seek and both motion preferences on desktop/mobile.
5. After a separately authorized deployment, repeat the affected checks on the actual public origin. Local results do not verify hosting or live performance.

To regenerate fonts, install `fonttools[woff]` in a local Python environment, then run `python scripts/optimize-fonts.py`. The script also supports the ignored `.preview-speed-tools` installation used here and uses Next's bundled Fontkit for shaping comparison. Update the static-heading constants and matching CSS unicode ranges if heading copy changes.

References: [Next font optimization](https://nextjs.org/docs/app/getting-started/fonts), [Next image optimization](https://nextjs.org/docs/app/getting-started/images), [Chrome network throttling](https://developer.chrome.com/docs/devtools/network/reference/#throttling), [W3C composite font selection](https://www.w3.org/TR/css-fonts-4/#composite-fonts), [FontTools subsetting](https://fonttools.readthedocs.io/en/latest/subset/index.html).
