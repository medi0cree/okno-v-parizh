import { INFO } from "../../lib/okno";
import { IconArrow, IconClock, IconPin, IconStar } from "./icons";

function Letters({ text, delay }: { text: string; delay: number }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span key={i} className="ch" style={{ animationDelay: `${delay + i * 0.06}s` }}>
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}

const WINDOWS: [number, number, number][] = [
  [8, 342, 0], [22, 342, 1.2], [36, 358, 0.4], [60, 340, 2.1], [74, 356, 0.9], [128, 342, 1.6],
  [142, 358, 0.2], [170, 342, 2.6], [184, 342, 1.1], [198, 358, 0.7], [228, 344, 1.9], [270, 342, 0.5],
  [284, 358, 2.3], [8, 370, 1.4], [60, 372, 0.3], [142, 374, 2.8], [198, 372, 1.7], [270, 374, 0.8],
];

const STARS: [number, number, number][] = [
  [30, 40, 0], [70, 80, 1], [120, 30, 2], [180, 60, 0.5], [240, 35, 1.5], [270, 90, 2.5], [210, 110, 0.8],
  [45, 130, 1.8], [150, 95, 2.2], [260, 140, 0.3], [95, 55, 1.2], [15, 95, 2.7],
];

function WindowScene() {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Вид из окна: ночной Париж, Эйфелева башня и горы Кавказа">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1524" />
          <stop offset="0.55" stopColor="#1c3453" />
          <stop offset="1" stopColor="#3a4f72" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F8DFA0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F8DFA0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="beam" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#F4C95D" stopOpacity="0.35" />
          <stop offset="1" stopColor="#F4C95D" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#sky)" />
      <g data-speed="0.04">
        {STARS.map(([x, y, d], i) => (
          <circle key={i} className="twinkle" cx={x} cy={y} r={i % 3 === 0 ? 1.4 : 0.9} fill="#F2F3EF" style={{ animationDelay: `${d}s` }} />
        ))}
      </g>
      <g data-speed="0.08">
        <circle cx="222" cy="92" r="48" fill="url(#moonGlow)" />
        <circle cx="222" cy="92" r="19" fill="#F8DFA0" />
        <circle cx="215" cy="87" r="3" fill="#EBCB7E" />
        <circle cx="228" cy="99" r="2" fill="#EBCB7E" />
      </g>
      <g data-speed="0.12">
        <path d="M-10 265 L40 205 L70 228 L120 158 L160 212 L200 172 L240 218 L270 192 L310 232 L310 400 L-10 400Z" fill="#2a4468" />
        <path d="M120 158 L107 176 L115 172 L121 180 L127 172 L135 178Z" fill="#C9D4DE" opacity="0.85" />
        <path d="M200 172 L189 185 L196 182 L202 188 L207 182 L213 186Z" fill="#C9D4DE" opacity="0.85" />
        <path d="M40 205 L33 214 L39 212 L43 216Z" fill="#C9D4DE" opacity="0.6" />
      </g>
      <g data-speed="0.2">
        <path d="M95 112 v10" stroke="#0f1b2d" strokeWidth="1.5" />
        <path d="M95 120 L97 150 L103 210 L112 262 L126 305 L114 305 Q95 276 76 305 L64 305 L78 262 L87 210 L93 150 Z" fill="#0f1b2d" />
        <path d="M86 212 h18 M77 264 h36 M91 170 h8" stroke="#F4C95D" strokeWidth="1" opacity="0.7" />
        <path className="beam-sweep" d="M95 116 L-40 40 L-40 62 Z" fill="url(#beam)" opacity="0.55" />
      </g>
      <g data-speed="0.3">
        <path d="M-10 330 L20 330 L30 310 L70 310 L80 330 L110 330 L110 300 L118 300 L118 330 L150 330 L160 305 L210 305 L220 330 L240 330 L240 296 L250 286 L260 296 L260 330 L310 330 L310 400 L-10 400Z" fill="#0b1524" />
        <rect x="40" y="298" width="7" height="14" fill="#0b1524" />
        <rect x="52" y="302" width="5" height="10" fill="#0b1524" />
        <rect x="178" y="292" width="8" height="15" fill="#0b1524" />
        {WINDOWS.map(([x, y, d], i) => (
          <rect key={i} className="twinkle" x={x} y={y} width="8" height="11" rx="1" fill="#F4C95D" style={{ animationDelay: `${d}s` }} />
        ))}
      </g>
      <g>
        <rect x="-10" y="384" width="320" height="20" fill="#16263d" />
        {[20, 44, 70, 230, 256, 280].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={378} r="7" fill="#D6453D" />
            <circle cx={x + 9} cy={373} r="5" fill="#A92F29" />
            <path d={`M${x} 384 v-6`} stroke="#2F5D50" strokeWidth="2" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Hero() {
  return (
    <section id="top" className="hero" data-parallax-root>
      <div>
        <p className="kicker" style={{ animation: "ch-in 1s .9s both" }}>
          Кухня Парижа и Кавказа · с 10:00 до 23:00
        </p>
        <h1 className="hero-title mt-4">
          <Letters text="Окно" delay={1.0} />
          <br />
          <em>
            <Letters text="в Париж" delay={1.25} />
          </em>
        </h1>
        <p className="lede mt-7" style={{ animation: "ch-in 1s 1.6s both" }}>
          Ресторан в Кизляре, где утро начинается с сырников и брускетты, днём подают хинкал и чуду,
          а вечером над мангалом поднимается дым от томагавка и саджа. Выберите блюдо по настроению,
          соберите банкет или просто загляните на чашку кофе в турке.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-5" style={{ animation: "ch-in 1s 1.8s both" }}>
          <HeroCta />
          <a href={INFO.phoneHref} className="group relative text-[15px] font-semibold text-[var(--paper)]">
            {INFO.phoneHuman}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-50 bg-[var(--lamp)] transition-transform duration-500 group-hover:scale-x-100" />
          </a>
        </div>
        <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 text-[14px] sm:grid-cols-3" style={{ animation: "ch-in 1s 2s both" }}>
          <div>
            <dt className="flex items-center gap-2 text-[var(--zinc)]"><IconPin size={15} /> Адрес</dt>
            <dd className="mt-1 font-semibold">{INFO.address}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-[var(--zinc)]"><IconClock size={15} /> Завтраки</dt>
            <dd className="mt-1 font-semibold">до {INFO.breakfastUntil}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-[var(--zinc)]"><IconStar size={14} /> Рейтинг</dt>
            <dd className="mt-1 font-semibold">4,7 в 2ГИС</dd>
          </div>
        </dl>
      </div>
      <div className="relative w-full">
        <div className="window-frame" data-speed="-0.06">
          <WindowScene />
          <div className="mullions" />
        </div>
        <p className="f-hand absolute -bottom-3 left-2 rotate-[-6deg] text-[26px] text-[var(--lamp)] md:left-6">
          вид из нашего окна
        </p>
      </div>
    </section>
  );
}

function HeroCta() {
  return (
    <a
      href="#menu"
      className="group relative inline-flex h-[60px] items-center gap-4 overflow-hidden rounded-full bg-[var(--lamp)] pl-7 pr-2 font-bold text-[var(--night)]"
    >
      <span className="relative z-10">Подобрать блюдо</span>
      <span className="relative z-10 grid h-[46px] w-[46px] place-items-center rounded-full bg-[var(--night)] text-[var(--lamp)] transition-transform duration-500 group-hover:rotate-[-45deg]">
        <IconArrow size={18} />
      </span>
      <span className="absolute inset-0 origin-left scale-x-0 bg-[var(--paper)] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-x-100" />
    </a>
  );
}

export function Marquee() {
  const words = ["Завтраки до 14:00", "Хинкал аварский", "Мангал на углях", "Садж на компанию", "Кофе в турке", "Пицца и паста", "Чуду", "Кальян", "Банкеты"];
  const row = (
    <span>
      {words.map((w) => (
        <span key={w}>
          {w}
          <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 1l2.4 6.6L19 10l-6.6 2.4L10 19l-2.4-6.6L1 10l6.6-2.4Z" fill="#F4C95D" />
          </svg>
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}
