import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { KITCHEN, type Dish } from "../../data/menu";
import { formatPrice } from "../../lib/okno";
import { IconArrow } from "./icons";

const ALL: Dish[] = KITCHEN.flatMap((c) => c.items);
export const byId = (id: string) => ALL.find((d) => d.id === id);

export function Shores() {
  const paris = [byId("pasty-4"), byId("zavtraki-6")];
  const cauc = [byId("dagestan-3"), byId("dagestan-13")];
  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="grid items-end gap-8 md:grid-cols-[1.2fr_1fr]">
          <h2 className="h2" data-rise="-2">
            Два берега <em>одного стола</em>
          </h2>
          <p className="lede" data-rise>
            Мы открыли окно сразу в две стороны. В одну видно Париж: брускетта с лососем, феттучине со
            сливочным соусом, кофе с собой. В другую видно горы: дюшбара, хинкал трёх видов, тонкое чуду
            и мясо с углей. Выбирать не обязательно, у нас принято заказывать и то, и другое.
          </p>
        </div>

        <div className="shores mt-14" data-scale-in>
          <article className="shore paris" data-parallax-root>
            <p className="kicker">Сторона первая</p>
            <h3 className="f-display mt-2 text-[clamp(34px,4vw,54px)] italic leading-none">Париж</h3>
            <p className="mt-4 max-w-sm text-[var(--zinc)]">
              Пасты, пицца на тонком тесте, брускетты, цезарь, крем-супы и сёмга в сливочном соусе.
            </p>
            <div className="shore-photos">
              {paris.map((d) => d && d.img && <img key={d.id} src={d.img} alt={d.name} loading="lazy" data-speed="0.1" />)}
            </div>
          </article>
          <article className="shore caucasus" data-parallax-root>
            <p className="kicker">Сторона вторая</p>
            <h3 className="f-display mt-2 text-[clamp(34px,4vw,54px)] italic leading-none">Кавказ</h3>
            <p className="mt-4 max-w-sm text-[var(--zinc)]">
              Хинкал тонкий, слоёный и аварский, чуду, шурпа, горский суп, садж и шах-плов для большого стола.
            </p>
            <div className="shore-photos">
              {cauc.map((d) => d && d.img && <img key={d.id} src={d.img} alt={d.name} loading="lazy" data-speed="0.1" />)}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

const SIGNATURE: { id: string; note: string }[] = [
  { id: "goryachee-12", note: "шипит на столе" },
  { id: "goryachee-8", note: "для большого застолья" },
  { id: "mangal-1", note: "250 ₽ за каждые 100 г" },
  { id: "dagestan-3", note: "по-аварски" },
  { id: "goryachee-9", note: "под сырной корочкой" },
  { id: "zavtraki-9", note: "лучшее начало дня" },
  { id: "holodnye-5", note: "на всю компанию" },
  { id: "dagestan-13", note: "тонкое, румяное" },
  { id: "mangal-2", note: "прямо с углей" },
];

export function Signature({ onOpen }: { onOpen: (d: Dish) => void }) {
  const [ref, api] = useEmblaCarousel({ align: "start", dragFree: true, loop: false });
  const prev = useCallback(() => api?.scrollPrev(), [api]);
  const next = useCallback(() => api?.scrollNext(), [api]);
  return (
    <section className="section !px-0" id="signature">
      <div className="wrap flex flex-wrap items-end justify-between gap-6 px-5">
        <div>
          <p className="kicker">Если пришли впервые</p>
          <h2 className="h2 mt-2" data-rise="-1">
            Коронные <em>блюда</em>
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="sig-arrow" onClick={prev} aria-label="Назад">
            <IconArrow dir="left" />
          </button>
          <button className="sig-arrow" onClick={next} aria-label="Вперёд">
            <IconArrow />
          </button>
        </div>
      </div>
      <div className="sig-viewport mt-10" ref={ref}>
        <div className="sig-track">
          {SIGNATURE.map(({ id, note }, i) => {
            const d = byId(id);
            if (!d) return null;
            return (
              <button key={id} className="sig-card text-left" onClick={() => onOpen(d)} aria-label={`${d.name}, подробнее`}>
                {d.img && <img src={d.img} alt={d.name} loading="lazy" draggable={false} />}
                <span className="shade" />
                <span className="f-display absolute left-6 top-6 text-[15px] tracking-[0.2em] text-[var(--lamp)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="cap">
                  <span className="f-hand block text-[24px] text-[var(--lamp)]">{note}</span>
                  <span className="f-display mt-1 block text-[30px] leading-[1.02]">{d.name}</span>
                  <span className="mt-3 inline-block rounded-full border border-[var(--line)] px-3 py-1 text-[14px] font-semibold">
                    {formatPrice(d.price, d.priceNote)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
