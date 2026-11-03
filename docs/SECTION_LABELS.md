# Section labels

Decorative labels immediately above section titles use `SectionLabel` from `src/components/home/section-label.tsx`. It owns the OriginalHandwritten font and signal-coloured squiggly underline. Use `inverse` on surfaces using foreground as their background; preserve alignment with the surrounding layout and pass existing data attributes for animation selectors.

The shared `SectionHeading` uses this by default. The homepage studio label, tagline, Reality Check and comparison headings, Services invitation, Founder introduction, Insights, final CTA, suggested-service panel, article index/related reading and case-study index use the same component.

Keep navigation, article/project metadata, form labels, card details and footer navigation headings in their existing functional typography. Do not select every mono/uppercase element globally.

The stroke draws once on mount and is immediately complete under reduced motion. Long labels wrap within the available width; underline width follows the text up to 240px. The font definition lives with the shared label stylesheet and is also used by the hero headline.

Verification limitation: ArticleReader is currently not mounted in the homepage, and /blog returns 404. Its label changes were checked in source; visual verification of that reader requires a separate routing repair. Its existing two React lint errors also reproduce against HEAD. Other changed components pass focused lint; case-study reader retains one existing unused eslint-disable warning.
