import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import type { Dish } from "../data/menu";
import { SmoothScroll } from "../components/okno/SmoothScroll";
import { Nav, Shutters } from "../components/okno/Top";
import { Hero, Marquee } from "../components/okno/Hero";
import { Shores, Signature } from "../components/okno/Story";
import { MenuFinder } from "../components/okno/MenuFinder";
import { DishSheet, Tray } from "../components/okno/Overlays";
import { Bar, Banket, Footer, Numbers, Visit } from "../components/okno/Sections";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [open, setOpen] = useState<Dish | null>(null);
  const [picked, setPicked] = useState<Record<string, number>>({});

  const toggle = useCallback((d: Dish) => {
    setPicked((p) => {
      const n = { ...p };
      if (n[d.id]) delete n[d.id];
      else n[d.id] = 1;
      return n;
    });
  }, []);
  const setQty = useCallback((id: string, q: number) => {
    setPicked((p) => {
      const n = { ...p };
      if (q <= 0) delete n[id];
      else n[id] = q;
      return n;
    });
  }, []);
  const close = useCallback(() => setOpen(null), []);

  return (
    <div className="grain">
      <SmoothScroll />
      <Shutters />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Shores />
        <Signature onOpen={setOpen} />
        <MenuFinder picked={picked} onToggle={toggle} onOpen={setOpen} />
        <Bar />
        <Banket />
        <Numbers />
        <Visit />
      </main>
      <Footer />
      <DishSheet dish={open} onClose={close} onOpen={setOpen} picked={picked} onToggle={toggle} />
      <Tray picked={picked} setQty={setQty} clear={() => setPicked({})} />
    </div>
  );
}
