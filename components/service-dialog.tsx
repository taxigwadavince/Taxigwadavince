"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Service } from "@/lib/content";
import { EASE } from "@/lib/utils";
import { Glyph, Icon } from "./icons";

type ServiceDialogProps = {
  service: Service;
  imagePosition: string;
  description: string;
  highlights: string[];
  href: string;
  action: string;
  trigger: HTMLButtonElement;
  onDismiss: () => void;
};

function isOutside(dialog: HTMLDialogElement, x: number, y: number) {
  const bounds = dialog.getBoundingClientRect();
  return x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom;
}

export function ServiceDialog({ service, imagePosition, description, highlights, href, action, trigger, onDismiss }: ServiceDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef(false);
  const id = useId();
  const reduced = useReducedMotion();
  const external = href.startsWith("https://");

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    element.showModal();

    return () => {
      if (element.open) element.close();
      root.style.overflow = previousOverflow;
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [trigger]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      aria-modal="true"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>("button, a[href]");
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClose={(event) => { if (!event.currentTarget.open) onDismiss(); }}
      onPointerDown={(event) => { backdropPress.current = event.target === event.currentTarget && isOutside(event.currentTarget, event.clientX, event.clientY); }}
      onClick={(event) => {
        if (backdropPress.current && event.target === event.currentTarget && isOutside(event.currentTarget, event.clientX, event.clientY)) event.currentTarget.close();
        backdropPress.current = false;
      }}
      className="service-dialog fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[920px] overscroll-contain overflow-x-hidden overflow-y-auto rounded-[28px] border-0 bg-creme p-0 text-encre shadow-[0_32px_100px_rgba(0,0,0,0.35)] backdrop:bg-vert-900/70 backdrop:backdrop-blur-sm sm:rounded-[32px]"
    >
      <div className="sticky top-0 z-20 h-0">
        <button
          type="button"
          autoFocus
          onClick={() => dialog.current?.close()}
          aria-label="Fermer la description du service"
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-creme text-vert-900 shadow-sm ring-1 ring-vert/10 transition-colors hover:bg-soleil focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-or sm:top-4 sm:right-4"
        >
          <Icon name="ph:x-bold" className="size-4" />
        </button>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="grid sm:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="relative isolate min-h-[205px] overflow-hidden bg-vert-900 sm:min-h-[540px]">
          <Image
            src={service.img}
            alt=""
            fill
            sizes={service.id === "vsl" ? "(min-width: 640px) 1620px, max(100vw, 615px)" : "(min-width: 640px) 810px, 100vw"}
            quality={85}
            style={{ objectPosition: imagePosition }}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,40,20,0.1)_30%,rgba(5,40,20,0.88)_100%)]" />
          <span className="absolute top-5 left-5 rounded-full bg-creme/95 px-3 py-2 text-[0.6rem] font-semibold tracking-[0.15em] text-vert uppercase sm:top-7 sm:left-7">971 · Guadeloupe</span>
          <div className="absolute right-6 bottom-6 left-6 text-creme sm:right-8 sm:bottom-8 sm:left-8">
            <Glyph name={service.icon} className="mb-3 size-10 text-soleil sm:size-14" />
            <p className="max-w-[24ch] text-sm font-medium leading-relaxed sm:text-base">{service.tag}</p>
          </div>
        </div>

        <div className="relative flex flex-col border-t border-dashed border-vert/20 px-5 py-7 sm:border-t-0 sm:border-l sm:px-8 sm:pt-16 sm:pb-8 lg:px-10">
          <span className="absolute -top-2.5 left-0 size-5 -translate-x-1/2 rounded-full bg-vert-900 sm:-top-2.5 sm:left-0" aria-hidden="true" />
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-vert uppercase">En route avec Vincent</p>
          <h2 id={`${id}-title`} className="mt-3 font-display text-[1.9rem] leading-[1.08] font-bold text-vert-900 sm:text-[2.25rem] lg:text-[2.6rem]">{service.title}</h2>
          <p id={`${id}-description`} className="mt-5 text-sm leading-relaxed text-gris sm:text-[0.95rem]">{description}</p>
          <ul className="mt-5 space-y-2.5">
            {highlights.map((highlight) => <li key={highlight} className="flex items-start gap-2 text-xs font-medium leading-relaxed text-vert sm:text-sm"><Icon name="ph:check-circle-bold" className="mt-0.5 size-4" />{highlight}</li>)}
          </ul>

          <div className="mt-auto pt-7">
            <Link
              href={href}
              onClick={() => dialog.current?.close()}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="group flex min-h-14 items-center justify-between gap-3 rounded-[28px] bg-vert py-2 pr-2 pl-5 text-sm font-semibold text-creme transition-colors hover:bg-vert-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vert"
            >
              <span>{action}{external && <span className="sr-only"> (nouvel onglet)</span>}</span>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-soleil text-vert-900"><Icon name={external ? "si:whatsapp" : "ph:arrow-right-bold"} className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          </div>
        </div>
      </motion.div>
    </dialog>
  );
}
