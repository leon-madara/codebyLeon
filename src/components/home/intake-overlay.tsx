"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProjectIntake } from "./project-intake";

/** Keep the originating page, its controls and scroll-driven scenes mounted. */
export function IntakeOverlay() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    element.showModal();
    return () => {
      element.close();
      document.documentElement.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return <dialog ref={dialog} role="dialog" aria-label="Start a project" className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 bg-background p-0 text-foreground backdrop:bg-background"
    onCancel={event => {
      event.preventDefault();
      // Escape follows the same save guard and exit transition as the X.
      dialog.current?.querySelector<HTMLButtonElement>('button[aria-label="Save & exit"]')?.click();
    }}>
    <ProjectIntake onExit={() => router.back()} scrollContainer={dialog} />
  </dialog>;
}
