import { SectionLabel } from "./section-label";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  label: string;
  headline: React.ReactNode;
  supporting?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Shared section header — a handwritten label with a squiggly underline,
 * display headline, and optional supporting paragraph. No pills, no boxes.
 */
export function SectionHeading({
  label,
  headline,
  supporting,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "mb-12 flex max-w-3xl flex-col gap-5 md:mb-16",
        centered && "items-center text-center",
        className
      )}
    >
      <SectionLabel>{label}</SectionLabel>

      <h2 className="text-balance font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {headline}
      </h2>

      {supporting ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {supporting}
        </p>
      ) : null}
    </Reveal>
  );
}
