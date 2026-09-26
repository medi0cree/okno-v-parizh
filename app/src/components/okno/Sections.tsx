import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { BAR, BANKET } from "../../data/menu";
import { INFO, formatPrice, kizlyarNow } from "../../lib/okno";
import { useOpenStatus, WindowMark } from "./Top";
import { IconClock, IconPhone, IconPin, IconStar } from "./icons";

/* ================= БАР ================= */
export function Bar() {
  const [tab, setTab] = useState(BAR[0].slug);
  const [peek, setPeek] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 28 });
  const sy = useSpring(y, { stiffness: 300, damping: 28 });
  const cat = BAR.find((b) => b.slug === tab) ?? BAR[0];
  const half = Math.ceil(cat.items.length / 2);

  const onMove = (e: MouseEvent) => {
    x.set(e.clientX + 24);
    y.set(e.clientY - 100);
  };

  return (
    <section id="bar" className="bar section" onMouseMove={onMove}>
      <div className="wrap">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="kicker">Бар и кофейня</p>
            <h2 className="h2 mt-2" data-rise="-1">
              Кофе, чай <em>и кальян</em>
            </h2>
          </div>
          <p className="lede">
            Кофе в турке, раф с урбечом, марокканский и облепиховый чай, горный мёд с орехом к чаю,
            лимонады кувшинами, свежевыжатые соки и кальян на фруктовой чаше.
          </p>
        </div>

        <div className="board mt-12">
          <div className="flex flex-wrap gap-x-2 gap-y-1 border-b border-dashed border-[rgba(242,243,239,0.2)] pb-4" role="tablist">
            {BAR.map((b) => (
              <button key={b.slug} role="tab" aria-selected={tab === b.slug} className="bar-tab" data-on={tab === b.slug} onClick={() => setTab(b.slug)}>
                {b.name}
                {tab === b.slug && (
                  <motion.svg layoutId="chalk" className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 5 C 25 2, 60 7, 98 3" stroke="#F4C95D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </motion.svg>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ y: 16, filter: "blur(4px)" }}
              animate={{ y: 0, filter: "blur(0px)" }}
              exit={{ y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.35 }}
              className="mt-4 grid gap-x-12 md:grid-cols-2"
            >
              {[cat.items.slice(0, half), cat.items.slice(half)].map((col, ci) => (
                <div key={ci}>
                  {col.map((it) => (
                    <div
                      key={it.id}
                      className="bar-row"
                      onMouseEnter={() => it.img && setPeek(it.img)}
                      onMouseLeave={() => setPeek(null)}
                    >
                      <div className="min-w-0">
                        <span className="nm">{it.name}</span>
                        {it.desc && <span className="block text-[13px] text-[rgba(242,243,239,0.55)]">{it.desc}</span>}
                      </div>
                      <span className="dots" />
                      <span className="pr">{formatPrice(it.price, it.priceNote)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          <p className="f-hand mt-6 text-[22px] text-[rgba(242,243,239,0.6)]">
            Лимонады: цена за стакан и за кувшин. Десерты дня спрашивайте у официанта.
          </p>
        </div>
      </div>
      <AnimatePresence>
        {peek && (
          <motion.div
            className="bar-peek hidden md:block"
            style={{ left: sx, top: sy }}
            initial={{ scale: 0.4, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <img src={peek} alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ================= БАНКЕТ ================= */
export function Banket() {
  const [guests, setGuests] = useState(20);
  const [qty, setQty] = useState<Record<string, number>>({});
  const all = BANKET.flatMap((c) => c.items);
  const sum = all.reduce((s, it) => s + it.price * (qty[it.id] ?? 0), 0);
  const per = guests > 0 ? Math.round(sum / guests) : 0;
  const bump = (id: string, d: number) => setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + d) }));

  const suggest = () => {
    const g = guests;
    const s: Record<string, number> = {};
    // Ориентир: по порции салата на 4 гостей, закуски по штуке на гостя, горячее на 6 гостей.
    BANKET[0].items.slice(0, 4).forEach((it) => (s[it.id] = Math.max(1, Math.round(g / 8))));
    BANKET[1].items.slice(0, 3).forEach((it) => (s[it.id] = Math.max(1, Math.round(g / 2))));
    s[BANKET[1].items[5].id] = Math.max(1, Math.round(g / 10));
    s[BANKET[2].items[5].id] = Math.max(1, Math.round(g / 10));
    s[BANKET[2].items[6].id] = Math.max(1, Math.round(g / 12));
    s[BANKET[2].items[7].id] = Math.max(1, Math.round(g / 8));
    setQty(s);
  };

  return (
    <section id="banket" className="banket section" data-parallax-root>
      <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="f-hand text-[28px] text-[var(--lamp-soft)]">Свадьбы, юбилеи, дни рождения</p>
          <h2 className="h2 mt-2" data-rise="-1">
            Банкет, собранный <em>вами</em>
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[rgba(242,243,239,0.9)]">
            Отметьте блюда из банкетного меню, укажите число гостей и сразу увидите примерную сумму и
            стоимость на человека. Итог уточним по телефону вместе с поваром.
          </p>
          <div className="mt-8 rounded-3xl bg-[rgba(15,27,45,0.18)] p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold">Гостей</span>
              <motion.span key={guests} initial={{ y: -8 }} animate={{ y: 0 }} className="f-display text-[48px] leading-none">
                {guests}
              </motion.span>
            </div>
            <input className="guests mt-3" type="range" min={5} max={200} step={5} value={guests} onChange={(e) => setGuests(Number(e.target.value))} aria-label="Количество гостей" />
            <button onClick={suggest} className="mt-4 text-[14px] font-bold underline decoration-dashed underline-offset-4">
              Предложить набор на {guests} гостей
            </button>
          </div>
        </div>

        <div className="ticket p-6 md:p-10">
          {BANKET.map((c) => (
            <div key={c.name} className="mb-8">
              <h3 className="f-display text-[34px] italic">{c.name}</h3>
              <div className="mt-2 divide-y divide-[rgba(15,27,45,0.08)]">
                {c.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-semibold">{it.name}</p>
                      <p className="text-[13px] text-[#56657a]">{it.price.toLocaleString("ru-RU")} ₽</p>
                    </div>
                    <div className="qty">
                      <button onClick={() => bump(it.id, -1)} aria-label={`Убрать ${it.name}`}>−</button>
                      <span>{qty[it.id] ?? 0}</span>
                      <button onClick={() => bump(it.id, 1)} aria-label={`Добавить ${it.name}`}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t-2 border-dashed border-[rgba(15,27,45,0.2)] pt-6">
            <div className="flex items-end justify-between">
              <span className="text-[#56657a]">Примерно</span>
              <span className="f-display text-[44px] leading-none">{sum.toLocaleString("ru-RU")} ₽</span>
            </div>
            <p className="mt-1 text-right text-[14px] text-[#56657a]">≈ {per.toLocaleString("ru-RU")} ₽ на гостя</p>
            <a href={INFO.phoneHref} className="banket-call mt-6">
              <span className="sweep" />
              <IconPhone />
              Обсудить банкет: {INFO.phoneHuman}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= ОТЗЫВЫ-ЦИФРЫ ================= */
function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        setV(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return <span ref={ref}>{v.toFixed(decimals).replace(".", ",")}</span>;
}

export function Numbers() {
  const items = [
    { n: 123, d: 0, l: "блюда в меню кухни" },
    { n: 13, d: 0, l: "разделов: от завтраков до мангала" },
    { n: 4.7, d: 1, l: "рейтинг в 2ГИС" },
    { n: 13, d: 0, l: "часов в день открыты для вас" },
  ];
  return (
    <section className="section !py-20">
      <div className="wrap grid grid-cols-2 gap-8 md:grid-cols-4">
        {items.map((it) => (
          <div key={it.l} className="border-t border-[var(--line)] pt-5" data-rise>
            <p className="f-display text-[clamp(56px,7vw,96px)] leading-none text-[var(--lamp)]">
              <CountUp to={it.n} decimals={it.d} />
            </p>
            <p className="mt-2 text-[var(--zinc)]">{it.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= КОНТАКТЫ ================= */
const DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

export function Visit() {
  const st = useOpenStatus();
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(kizlyarNow().day), []);
  const rows = useMemo(() => DAYS.map((d, i) => ({ d, i })), []);
  return (
    <section id="visit" className="section">
      <div className="wrap">
        <p className="kicker">Кизляр, {INFO.address}</p>
        <h2 className="h2 mt-2" data-rise="-1">
          Приходите, <em>окно открыто</em>
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-6">
            <div className="visit-card">
              <div className="flex items-center gap-3 text-[var(--zinc)]">
                <IconPhone /> Бронь, доставка, банкеты
              </div>
              <a href={INFO.phoneHref} className="big-phone mt-3 inline-block">
                {INFO.phoneHuman}
              </a>
              <div className="mt-5 flex flex-wrap gap-2">
                {INFO.services.map((s) => (
                  <span key={s} className="rounded-full border border-[var(--line)] px-3 py-1.5 text-[13px] text-[var(--zinc)]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="visit-card">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3 text-[var(--zinc)]"><IconClock /> Часы работы</span>
                <span className="inline-flex items-center gap-2 text-[13px]">
                  <span className={`status-dot ${st?.open ? "on" : ""}`} />
                  {st?.label ?? "Ежедневно"}
                </span>
              </div>
              <div className="mt-3">
                {rows.map(({ d, i }) => (
                  <div key={d} className="hours-row" data-today={today === i}>
                    <span>{d}</span>
                    <span>10:00–23:00</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[14px] text-[var(--zinc)]">Завтраки подаём до 14:00.</p>
            </div>
            <div className="visit-card grid grid-cols-2 gap-4">
              {INFO.ratings.map((r) => (
                <div key={r.source}>
                  <p className="flex items-center gap-2 text-[var(--lamp)]">
                    <span className="f-display text-[46px] leading-none">{r.value}</span>
                    <IconStar size={20} />
                  </p>
                  <p className="mt-1 text-[14px] font-semibold">{r.source}</p>
                  <p className="text-[13px] text-[var(--zinc)]">{r.count}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="map-frame flex-1">
              <iframe src={INFO.maps.yandexWidget} title="Окно в Париж на карте" loading="lazy" allowFullScreen />
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="route-link" href={INFO.maps.yandex} target="_blank" rel="noreferrer"><IconPin size={16} /> Яндекс Карты</a>
              <a className="route-link" href={INFO.maps.gis} target="_blank" rel="noreferrer"><IconPin size={16} /> 2ГИС</a>
              <a className="route-link" href={INFO.maps.google} target="_blank" rel="noreferrer"><IconPin size={16} /> Google Карты</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-[var(--line)] pt-16">
      <div className="wrap flex flex-wrap items-start justify-between gap-8 px-5">
        <div className="flex items-center gap-3">
          <WindowMark size={40} />
          <div>
            <p className="f-display text-[26px] italic leading-none">Окно в Париж</p>
            <p className="text-[13px] text-[var(--zinc)]">{INFO.city}, {INFO.address}</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-5 text-[14px] text-[var(--zinc)]" aria-label="Нижнее меню">
          <a href="#menu" className="hover:text-[var(--lamp)]">Меню</a>
          <a href="#bar" className="hover:text-[var(--lamp)]">Бар</a>
          <a href="#banket" className="hover:text-[var(--lamp)]">Банкеты</a>
          <a href="#visit" className="hover:text-[var(--lamp)]">Контакты</a>
          <a href={INFO.phoneHref} className="hover:text-[var(--lamp)]">{INFO.phoneHuman}</a>
        </nav>
      </div>
      <p className="px-5 pt-6 text-center text-[12px] text-[rgba(201,212,222,0.55)]">
        Цены указаны по меню ресторана и могут меняться. Точную стоимость уточняйте по телефону.
      </p>
      <div className="footer-word mt-6 text-center" data-parallax-root>
        <span data-speed="-0.08" className="inline-block">Bon appétit</span>
      </div>
    </footer>
  );
}
