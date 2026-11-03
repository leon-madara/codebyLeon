"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CalendarCheck,
  Clapperboard,
  FileText,
  Home,
  Layers,
  Lightbulb,
  Rocket,
  Search,
  UserRound,
  Wrench,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { openConfigurator } from "./configurator";
import { openCaseStudy } from "./case-study-reader";

export const OPEN_COMMAND_EVENT = "cbl:open-command";

const SECTIONS = [
  { id: "top", label: "Hero", icon: Home },
  { id: "reality", label: "The Reality Check", icon: Lightbulb },
  { id: "services", label: "Website Services", icon: Layers },
  { id: "founder", label: "Founder & Philosophy", icon: UserRound },
  { id: "work", label: "Selected Works", icon: Briefcase },
  { id: "articles", label: "Recent Articles", icon: FileText },
  { id: "contact", label: "Get In Touch", icon: CalendarCheck },
];

const ENGAGEMENTS = [
  { label: "Start a New Website", hint: "New Builds", href: "/get-started.html?tier=custom-website", icon: Rocket },
  { label: "Redesign Your Website", hint: "Redesign", href: "/get-started.html?tier=redesign-modernization", icon: Wrench },
  { label: "Build a Custom Portal", hint: "Systems", href: "/get-started.html?tier=portals-workflows", icon: Layers },
  { label: "Start Your Project", hint: "7 short questions", href: "/get-started.html", icon: Clapperboard },
  { label: "Talk About Your Project", hint: "20 minutes", href: "/get-started.html?intent=discovery-call", icon: CalendarCheck },
];

const EXPLORE = [
  { label: "All Case Studies", href: "/work", icon: Briefcase },
  { label: "Kossy Langat — Portfolio Website", href: "/work/kossy-langat", icon: ArrowUpRight },
  { label: "Delivah Dispatch — Carrier Intake Portal", href: "/work/delivah-dispatch-hub", icon: ArrowUpRight },
  { label: "Legit Logistics — Dispatch & Driver App", href: "/work/legit-logistics", icon: ArrowUpRight },
  { label: "Blog — Latest Insights", href: "/blog", icon: BookOpen },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_COMMAND_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpen);
    };
  }, []);

  const jump = (id: string) => {
    setOpen(false);
    if (id === "work") {
      openCaseStudy("/work");
      return;
    }
    if (window.location.pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    requestAnimationFrame(() => {
      // Use the same curtain and pinned-section handlers as visible navigation.
      document.querySelector<HTMLAnchorElement>(`a[href="#${id}"]`)?.click();
    });
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Search sections, services, and projects"
      className="top-[18%] translate-y-0 border-border bg-popover/95 backdrop-blur-xl sm:max-w-lg"
    >
      <CommandInput placeholder="Search sections, services, projects…" />
      <CommandList className="scroll-slim max-h-[380px]">
        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
          No results found.
        </CommandEmpty>

        <CommandGroup heading="Jump to section">
          {SECTIONS.map((s) => (
            <CommandItem
              key={s.id}
              value={`section ${s.label}`}
              onSelect={() => jump(s.id)}
              className="rounded-[3px] text-muted-foreground data-[selected=true]:bg-signal/10 data-[selected=true]:text-signal"
            >
              <s.icon aria-hidden />
              {s.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="bg-border" />

        <CommandGroup heading="Start a project">
          {ENGAGEMENTS.map((e) => (
            <CommandItem
              key={e.href}
              value={`engagement ${e.label} ${e.hint}`}
              onSelect={() => {
                setOpen(false);
                openConfigurator(e.href);
              }}
              className="rounded-[3px] text-muted-foreground data-[selected=true]:bg-signal/10 data-[selected=true]:text-signal"
            >
              <e.icon aria-hidden />
              {e.label}
              <CommandShortcut className="text-muted-foreground/60">{e.hint}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="bg-border" />

        <CommandGroup heading="Explore work">
          {EXPLORE.map((e) => (
            <CommandItem
              key={e.href}
              value={`explore ${e.label}`}
              onSelect={() => {
                setOpen(false);
                if (e.href.startsWith("/work")) openCaseStudy(e.href);
                else window.location.href = e.href;
              }}
              className="rounded-[3px] text-muted-foreground data-[selected=true]:bg-signal/10 data-[selected=true]:text-signal"
            >
              <e.icon aria-hidden />
              {e.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="bg-border" />

        <p className="flex items-center gap-2 px-3 py-2.5 text-xs text-muted-foreground">
          <Search className="size-3" aria-hidden />
          Tip: press
          <span className="kbd-hint">Ctrl</span>
          <span className="kbd-hint">K</span>
          anywhere to open this palette
        </p>
      </CommandList>
    </CommandDialog>
  );
}
