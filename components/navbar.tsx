"use client";

// MCP: "navbar sticky" -> Sticky Header Navbar (21st.dev #27109) : barre sticky, menu mobile animé (AnimatePresence).
// Adapté : pleine largeur (règle Tom 0.9), un seul CTA, pastille animée sur la page active (layoutId),
// menu plein écran rendu HORS de la barre floutée (piège backdrop-filter, retour PSP 258).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, site, bookingHref } from "@/lib/site";
import { Wordmark } from "./logo";
import { Icon } from "./icons";
import { cn, EASE } from "@/lib/utils";

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const overHero = path === "/" && !scrolled;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuToggle.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          overHero ? "bg-transparent" : "bg-creme/88 shadow-[0_1px_0_rgba(10,70,36,0.08)] backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Taxi Gwada Vince, accueil">
            <Wordmark tone={overHero ? "sombre" : "clair"} />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 xl:flex">
            {nav.map((l) => {
              const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[0.93rem] font-medium whitespace-nowrap transition-colors",
                    overHero ? "text-white/90 hover:text-white" : "text-encre/75 hover:text-vert",
                    active && (overHero ? "text-vert-900 hover:text-vert-900" : "text-creme hover:text-creme"),
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn("absolute inset-0 rounded-full", overHero ? "bg-soleil" : "bg-vert")}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.phoneHref}
              className={cn(
                "hidden items-center gap-2 rounded-full px-3 py-2 text-[0.92rem] font-semibold tabular xl:inline-flex",
                overHero ? "text-white" : "text-vert",
              )}
            >
              <Icon name="ph:phone-bold" className="size-4" />
              {site.phoneDisplay}
            </a>
            <Link
              href={bookingHref}
              className="hidden h-11 items-center gap-2 rounded-full bg-or px-5 text-[0.93rem] font-semibold text-vert-900 transition-colors hover:bg-soleil sm:inline-flex"
            >
              Réserver
              <Icon name="ph:arrow-up-right-bold" className="size-4" />
            </Link>
            <button
              ref={menuToggle}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              className={cn(
                "grid size-11 place-items-center rounded-full xl:hidden",
                overHero ? "bg-white/15 text-white ring-1 ring-white/30 backdrop-blur" : "bg-vert text-creme",
              )}
            >
              <Icon name={open ? "ph:x-bold" : "ph:list-bold"} className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            className="fixed inset-0 z-40 flex flex-col gap-8 overflow-y-auto bg-vert-900 px-5 pt-24 pb-8 xl:hidden"
            initial={{ clipPath: "circle(0% at 92% 36px)" }}
            animate={{ clipPath: "circle(150% at 92% 36px)" }}
            exit={{ clipPath: "circle(0% at 92% 36px)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <nav aria-label="Menu mobile" className="flex flex-col">
              {[...nav, { label: "Réserver une course", href: bookingHref }].map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={path === l.href ? "page" : undefined}
                    className={cn(
                      "flex min-h-14 items-center justify-between border-b border-white/10 font-display text-[1.7rem] font-bold",
                      path === l.href ? "text-soleil" : "text-creme",
                    )}
                  >
                    {l.label}
                    <Icon name="ph:arrow-right-bold" className="size-5 text-or" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto grid gap-3">
              <a href={site.phoneHref} className="flex h-14 items-center justify-center gap-2 rounded-full bg-or font-semibold text-vert-900">
                <Icon name="ph:phone-bold" /> Appeler {site.phoneDisplay}
              </a>
              <a href={site.whatsapp} target="_blank" rel="noreferrer" className="flex h-14 items-center justify-center gap-2 rounded-full bg-white/10 font-semibold text-creme ring-1 ring-white/20">
                <Icon name="si:whatsapp" /> Écrire sur WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
