import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { KITCHEN, type Dish } from "../../data/menu";
import { INFO, formatPrice } from "../../lib/okno";
import { catName, tagLabel } from "./MenuFinder";
import { IconChat, IconCheck, IconClose, IconPhone, IconPlus } from "./icons";

const ALL: Dish[] = KITCHEN.flatMap((c) => c.items);

function similar(d: Dish): Dish[] {
  return ALL.filter((x) => x.id !== d.id && x.img)
    .map((x) => ({ x, s: x.tags.filter((t) => d.tags.includes(t)).length }))
    .filter((o) => o.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((o) => o.x);
}

export function DishSheet({
  dish,
  onClose,
  onOpen,
  picked,
  onToggle,
}: {
  dish: Dish | null;
  onClose: () => void;
  onOpen: (d: Dish) => void;
  picked: Record<string, number>;
  onToggle: (d: Dish) => void;
}) {
  useEffect(() => {
    if (!dish) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [dish, onClose]);

  const like = useMemo(() => (dish ? similar(dish) : []), [dish]);

  return (
    <AnimatePresence>
      {dish && (
        <motion.div
          className="sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={dish.name}
        >
          <motion.div
            key={dish.id}
            className="sheet"
            initial={{ y: 60, scale: 0.94, rotate: -1.5 }}
            animate={{ y: 0, scale: 1, rotate: 0 }}
            exit={{ y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <div className="ph relative">
              {dish.img ? (
                <img src={dish.img} alt={dish.name} />
              ) : (
                <div className="dish h-full"><span className="noimg h-full">{dish.name}</span></div>
              )}
            </div>
            <div className="relative p-7 md:p-9">
              <button onClick={onClose} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-[var(--mist)]" aria-label="Закрыть">
                <IconClose />
              </button>
              <p className="f-hand text-[24px] text-[var(--grenadine)]">{catName(dish.id)}</p>
              <h3 className="f-display mt-1 pr-10 text-[40px] leading-[1]">{dish.name}</h3>
              {dish.desc && <p className="mt-4 text-[15px] leading-relaxed text-[#4a5a70]">{dish.desc}</p>}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {dish.tags.map((t) => (
                  <span key={t} className="mini-tag">{tagLabel(t)}</span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-[rgba(15,27,45,0.1)] pt-5">
                <span className="price-tag !text-[32px]">{formatPrice(dish.price, dish.priceNote)}</span>
                <button
                  onClick={() => onToggle(dish)}
                  className={`inline-flex h-12 items-center gap-2 rounded-full px-5 font-bold transition-colors ${
                    picked[dish.id] ? "bg-[var(--moss)] text-white" : "bg-[var(--grenadine)] text-white hover:bg-[var(--grenadine-deep)]"
                  }`}
                >
                  {picked[dish.id] ? <IconCheck /> : <IconPlus />}
                  {picked[dish.id] ? "В столике" : "В мой столик"}
                </button>
              </div>
              {like.length > 0 && (
                <div className="mt-7">
                  <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#4a5a70]">Похоже по вкусу</p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {like.map((x) => (
                      <button key={x.id} onClick={() => onOpen(x)} className="group text-left">
                        <span className="block aspect-square overflow-hidden rounded-xl bg-[var(--mist)]">
                          <img src={x.img ?? ""} alt={x.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                        </span>
                        <span className="mt-1.5 block text-[12.5px] font-semibold leading-tight">{x.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Tray({
  picked,
  setQty,
  clear,
}: {
  picked: Record<string, number>;
  setQty: (id: string, q: number) => void;
  clear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rows = Object.entries(picked)
    .map(([id, q]) => ({ d: ALL.find((x) => x.id === id), q }))
    .filter((r): r is { d: Dish; q: number } => !!r.d);
  const count = rows.reduce((s, r) => s + r.q, 0);
  const sum = rows.reduce((s, r) => s + (r.d.price ?? 0) * r.q, 0);
  const hasWeighted = rows.some((r) => r.d.price === null);
  const waText = encodeURIComponent(
    `Здравствуйте! Хочу заказать в «Окно в Париж»:\n${rows.map((r) => `- ${r.d.name} × ${r.q}`).join("\n")}\nИтого примерно ${sum} ₽`,
  );

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.aside
          className="tray"
          initial={{ y: 120, rotate: 3 }}
          animate={{ y: 0, rotate: 0 }}
          exit={{ y: 160 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          aria-label="Мой столик"
        >
          <button className="flex w-full items-center justify-between gap-3 px-5 py-4" onClick={() => setOpen((o) => !o)}>
            <span className="flex items-center gap-3">
              <motion.span key={count} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="grid h-9 w-9 place-items-center rounded-full bg-[var(--lamp)] font-bold text-[var(--night)]">
                {count}
              </motion.span>
              <span className="text-left">
                <span className="f-display block text-[22px] italic leading-none">Мой столик</span>
                <span className="text-[12.5px] text-[var(--zinc)]">{open ? "свернуть" : "нажмите, чтобы открыть"}</span>
              </span>
            </span>
            <span className="f-display text-[26px]">
              {sum.toLocaleString("ru-RU")} ₽{hasWeighted ? "+" : ""}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="max-h-[42svh] overflow-auto border-t border-[var(--line)] px-5 py-3" data-lenis-prevent>
                  {rows.map(({ d, q }) => (
                    <div key={d.id} className="flex items-center justify-between gap-3 py-2">
                      <span className="text-[14px] leading-tight">{d.name}</span>
                      <span className="flex items-center gap-2">
                        <button className="h-7 w-7 rounded-lg bg-white/10" onClick={() => setQty(d.id, q - 1)} aria-label="Меньше">−</button>
                        <b className="w-5 text-center tabular-nums">{q}</b>
                        <button className="h-7 w-7 rounded-lg bg-white/10" onClick={() => setQty(d.id, q + 1)} aria-label="Больше">+</button>
                      </span>
                    </div>
                  ))}
                  {hasWeighted && <p className="mt-2 text-[12px] text-[var(--zinc)]">Блюда на вес посчитает официант.</p>}
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-[var(--line)] p-4">
                  <a href={INFO.phoneHref} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--lamp)] font-bold text-[var(--night)]">
                    <IconPhone size={16} /> Позвонить
                  </a>
                  <a href={`${INFO.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--line)] font-bold">
                    <IconChat size={16} /> WhatsApp
                  </a>
                  <button onClick={clear} className="col-span-2 pt-1 text-[12.5px] text-[var(--zinc)] underline underline-offset-4">
                    Очистить столик
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
