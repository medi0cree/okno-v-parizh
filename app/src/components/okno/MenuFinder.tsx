import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { KITCHEN, type Dish } from "../../data/menu";
import { MOODS, PRICE_BUCKETS, TAGS, formatPrice, type TagKey } from "../../lib/okno";
import { IconCheck, IconDice, IconPlus, IconSearch, TagIcon } from "./icons";

const CAT_OF: Record<string, string> = {};
KITCHEN.forEach((c) => c.items.forEach((d) => (CAT_OF[d.id] = c.name)));
export const catName = (id: string) => CAT_OF[id] ?? "";
export const tagLabel = (k: string) => TAGS.find((t) => t.key === k)?.label ?? k;

type Props = {
  picked: Record<string, number>;
  onToggle: (d: Dish) => void;
  onOpen: (d: Dish) => void;
};

export function MenuFinder({ picked, onToggle, onOpen }: Props) {
  const [tags, setTags] = useState<TagKey[]>([]);
  const [cat, setCat] = useState<string>("all");
  const [price, setPrice] = useState<string>("all");
  const [q, setQ] = useState("");
  const [mood, setMood] = useState<number | null>(null);

  const toggleTag = (k: TagKey) => {
    setMood(null);
    setTags((t) => (t.includes(k) ? t.filter((x) => x !== k) : [...t, k]));
  };
  const pickMood = (i: number) => {
    if (mood === i) {
      setMood(null);
      setTags([]);
      return;
    }
    setMood(i);
    setTags(MOODS[i].tags);
    setCat("all");
  };
  const reset = () => {
    setTags([]);
    setCat("all");
    setPrice("all");
    setQ("");
    setMood(null);
  };

  const bucket = PRICE_BUCKETS.find((b) => b.key === price) ?? PRICE_BUCKETS[0];
  const query = q.trim().toLowerCase();

  const groups = useMemo(() => {
    return KITCHEN.filter((c) => cat === "all" || c.slug === cat)
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (d) =>
            tags.every((t) => d.tags.includes(t)) &&
            bucket.test(d.price) &&
            (!query || d.name.toLowerCase().includes(query) || d.desc.toLowerCase().includes(query)),
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [cat, tags, bucket, query]);

  const total = groups.reduce((s, g) => s + g.items.length, 0);
  const dirty = tags.length > 0 || cat !== "all" || price !== "all" || q !== "";

  const surprise = () => {
    const pool = groups.flatMap((g) => g.items).filter((d) => d.img);
    const src = pool.length ? pool : KITCHEN.flatMap((c) => c.items).filter((d) => d.img);
    onOpen(src[Math.floor(Math.random() * src.length)]);
  };

  return (
    <section id="menu" className="menu-shell section">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end">
          <div>
            <p className="kicker">Меню-витрина · {KITCHEN.reduce((s, c) => s + c.items.length, 0)} блюд</p>
            <h2 className="h2 mt-2" data-rise="-1">
              Найдите блюдо <em>по вкусу</em>
            </h2>
          </div>
          <p className="lede">
            Начните с настроения, уточните вкус и бюджет, а мы покажем подходящие блюда из кухни.
            Нажмите на карточку, чтобы увидеть подробности и похожие блюда, или добавьте её в свой столик
            и позвоните нам, чтобы заказать.
          </p>
        </div>

        <div className="mt-12">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-[#4a5a70]">Под настроение</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {MOODS.map((m, i) => (
              <button key={m.title} className="mood-card" data-on={mood === i} onClick={() => pickMood(i)}>
                <span className="f-display block text-[21px] leading-[1.05]">{m.title}</span>
                <span className="mt-2 block text-[13px] opacity-70">{m.line}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-[#4a5a70]">Вкус и характер</p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button key={t.key} className="chip" data-on={tags.includes(t.key)} onClick={() => toggleTag(t.key)} title={t.hint}>
                <TagIcon tag={t.key} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-[auto_1fr_auto]">
          <div className="flex rounded-2xl border border-[rgba(15,27,45,0.14)] bg-white p-1">
            {PRICE_BUCKETS.map((b) => (
              <button
                key={b.key}
                onClick={() => setPrice(b.key)}
                className="relative rounded-xl px-3 py-2 text-[13px] font-semibold"
              >
                {price === b.key && (
                  <motion.span layoutId="price-pill" className="absolute inset-0 rounded-xl bg-[var(--night)]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                )}
                <span className={`relative ${price === b.key ? "text-[var(--paper)]" : ""}`}>{b.label}</span>
              </button>
            ))}
          </div>
          <label className="search">
            <IconSearch />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Например: хинкал, сёмга, сырники" aria-label="Поиск по меню" />
          </label>
          <button className="surprise" onClick={surprise}>
            <IconDice className="die" />
            Удивите меня
          </button>
        </div>
      </div>

      <div className="cat-rail mt-10">
        <div className="wrap cat-rail-inner">
          {[{ slug: "all", name: "Всё меню" }, ...KITCHEN].map((c) => (
            <button key={c.slug} className="cat-tab" data-on={cat === c.slug} onClick={() => setCat(c.slug)}>
              {cat === c.slug && (
                <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-[10px] bg-[var(--lamp)]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              )}
              <span className="relative">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="wrap mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] text-[#4a5a70]">
            Найдено: <b className="text-[var(--night)]">{total}</b>
            {tags.length > 0 && <> · {tags.map(tagLabel).join(" + ")}</>}
          </p>
          {dirty && (
            <button onClick={reset} className="text-[14px] font-semibold text-[var(--grenadine)] underline decoration-dashed underline-offset-4">
              Сбросить фильтры
            </button>
          )}
        </div>

        {total === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-[rgba(15,27,45,0.25)] p-10 text-center">
            <p className="f-display text-[34px] italic">Такого сочетания нет</p>
            <p className="mt-2 text-[#4a5a70]">Уберите один из фильтров или позвоните нам: повар подскажет, что приготовить.</p>
          </div>
        )}

        {groups.map((g) => (
          <div key={g.slug} className="mt-12">
            <div className="flex items-baseline gap-4">
              <h3 className="f-display text-[clamp(30px,3.4vw,46px)] leading-none">{g.name}</h3>
              {g.note && <span className="f-hand text-[22px] text-[var(--grenadine)]">{g.note}</span>}
              <span className="h-px flex-1 bg-[rgba(15,27,45,0.12)]" />
            </div>
            <motion.div layout className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <AnimatePresence initial={false} mode="popLayout">
                {g.items.map((d) => (
                  <motion.div
                    key={d.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <DishCard d={d} on={!!picked[d.id]} onToggle={onToggle} onOpen={onOpen} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DishCard({ d, on, onToggle, onOpen }: { d: Dish; on: boolean; onToggle: (d: Dish) => void; onOpen: (d: Dish) => void }) {
  return (
    <article className="dish h-full">
      <button className="ph block w-full" onClick={() => onOpen(d)} aria-label={`${d.name}, подробнее`}>
        {d.img ? <img src={d.img} alt={d.name} loading="lazy" /> : <span className="noimg">{d.name}</span>}
      </button>
      <div className="flex flex-1 flex-col p-5">
        <button onClick={() => onOpen(d)} className="text-left">
          <h4 className="text-[17px] font-bold leading-snug">{d.name}</h4>
          {d.desc && <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-[#56657a]">{d.desc}</p>}
        </button>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {d.tags.slice(0, 3).map((t) => (
            <span key={t} className="mini-tag">{tagLabel(t)}</span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between pt-5">
          <span className="price-tag">{formatPrice(d.price, d.priceNote)}</span>
          <button className="add-btn" data-on={on} onClick={() => onToggle(d)} aria-label={on ? "Убрать из столика" : "Добавить в столик"}>
            {on ? <IconCheck /> : <IconPlus />}
          </button>
        </div>
      </div>
    </article>
  );
}
