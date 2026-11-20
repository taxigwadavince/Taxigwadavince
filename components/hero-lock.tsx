"use client";

// INSPIRATION: premiere-version-site piège 14 + HeroLock d'Association Autrement : hauteur du hero verrouillée en px.
// Ordinateur : hauteur réelle recalculée à chaque redimensionnement. Téléphone : visualViewport, recalculé
// seulement si la largeur change (la barre d'adresse qui se rétracte ne fait rien bouger).
import { useEffect, useRef } from "react";

export function useHeroLock<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let lastW = 0;
    const apply = (force = false) => {
      const w = window.innerWidth;
      if (!fine && !force && w === lastW) return;
      lastW = w;
      const h = fine ? document.documentElement.clientHeight : Math.round(window.visualViewport?.height ?? window.innerHeight);
      const hh = Math.max(448, h);
      el.style.height = `${hh}px`;
      el.style.setProperty("--hh", `${hh}px`);
    };
    apply(true);
    const on = () => apply();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return ref;
}
