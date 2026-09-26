import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Lenis + GSAP ScrollTrigger, связанные через gsap.ticker.
 * Параллакс: любой элемент с data-speed="0.2" сдвигается при прокрутке (только transform).
 * Появление: data-rise, анимируется только transform (текст виден всегда, даже на скриншоте).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.2");
        gsap.to(el, {
          yPercent: -100 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("[data-parallax-root]") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
        gsap.from(el, {
          y: 60,
          rotate: parseFloat(el.dataset.rise || "0"),
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-scale-in]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.86, borderRadius: "60px" },
          {
            scale: 1,
            borderRadius: "28px",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true },
          },
        );
      });
    });

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.4 });
    };
    document.addEventListener("click", onAnchor);

    return () => {
      document.removeEventListener("click", onAnchor);
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
