// Реальные данные ресторана «Окно в Париж» (Кизляр). Источники: oknorest.ru, 2ГИС, Google Maps.
export const INFO = {
  name: "Окно в Париж",
  city: "Кизляр, Республика Дагестан",
  address: "ул. Циолковского, 1/1",
  postal: "368832",
  phoneHuman: "8 (928) 046-65-67",
  phoneHref: "tel:+79280466567",
  whatsapp: "https://wa.me/79280466567",
  open: 10,
  close: 23,
  breakfastUntil: "14:00",
  services: ["Ужин в зале", "Еда навынос", "Доставка", "Банкеты", "Кальян"],
  ratings: [
    { source: "Google Карты", value: "4,3", count: "195 отзывов" },
    { source: "2ГИС", value: "4,7", count: "27 оценок" },
  ],
  maps: {
    yandex: "https://yandex.ru/maps/org/okno_v_parizh/56412539423/",
    yandexWidget: "https://yandex.ru/map-widget/v1/org/okno_v_parizh/56412539423/",
    gis: "https://2gis.ru/kizlyar/firm/70000001054976234",
    google: "https://www.google.com/maps/search/?api=1&query=%D0%9E%D0%BA%D0%BD%D0%BE+%D0%B2+%D0%9F%D0%B0%D1%80%D0%B8%D0%B6+%D0%9A%D0%B8%D0%B7%D0%BB%D1%8F%D1%80+%D0%A6%D0%B8%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%B3%D0%BE+1",
  },
} as const;

export type TagKey =
  | "meat"
  | "fish"
  | "light"
  | "hearty"
  | "spicy"
  | "veg"
  | "sweet"
  | "share"
  | "dag"
  | "euro"
  | "breakfast";

export const TAGS: { key: TagKey; label: string; hint: string }[] = [
  { key: "meat", label: "Мясное", hint: "говядина, баранина, курица" },
  { key: "fish", label: "Рыба и море", hint: "сёмга, креветки, дорадо" },
  { key: "light", label: "Лёгкое", hint: "без тяжести" },
  { key: "hearty", label: "Сытное", hint: "когда голоден всерьёз" },
  { key: "spicy", label: "С огоньком", hint: "пикантно и остро" },
  { key: "veg", label: "Без мяса", hint: "овощи, сыр, тесто" },
  { key: "sweet", label: "Сладкое", hint: "каши, сырники, панкейки" },
  { key: "share", label: "На компанию", hint: "делить на всех" },
  { key: "dag", label: "Кавказ", hint: "хинкал, чуду, садж" },
  { key: "euro", label: "Европа", hint: "пасты, брускетты, цезарь" },
  { key: "breakfast", label: "Завтрак", hint: "до 14:00" },
];

export const MOODS: { title: string; line: string; tags: TagKey[] }[] = [
  { title: "Как у бабушки в горах", line: "хинкал, чуду, шурпа", tags: ["dag", "hearty"] },
  { title: "Лёгкий ужин вдвоём", line: "салаты, рыба, крем-супы", tags: ["light"] },
  { title: "Компанией у мангала", line: "шашлык, садж, плато", tags: ["share", "meat"] },
  { title: "Рыбный вечер", line: "сёмга, дорадо, креветки", tags: ["fish"] },
  { title: "Сладкое утро", line: "сырники, каши, панкейки", tags: ["breakfast", "sweet"] },
  { title: "Парижский обед", line: "пасты, брускетты, цезарь", tags: ["euro"] },
];

export const PRICE_BUCKETS: { key: string; label: string; test: (p: number | null) => boolean }[] = [
  { key: "all", label: "Любой чек", test: () => true },
  { key: "lo", label: "до 400 ₽", test: (p) => p !== null && p <= 400 },
  { key: "mid", label: "400–700 ₽", test: (p) => p !== null && p > 400 && p <= 700 },
  { key: "hi", label: "от 700 ₽", test: (p) => p === null || p > 700 },
];

export function formatPrice(price: number | null, note: string | null): string {
  if (note) return note;
  if (price === null) return "по запросу";
  return `${price.toLocaleString("ru-RU")} ₽`;
}

/** Время в Кизляре (UTC+3, как Москва). Вызывать только на клиенте. */
export function kizlyarNow(): { h: number; m: number; day: number } {
  const parts = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "";
  const map: Record<string, number> = { пн: 0, вт: 1, ср: 2, чт: 3, пт: 4, сб: 5, вс: 6 };
  return { h, m, day: map[wd.replace(".", "").toLowerCase()] ?? 0 };
}

export function openStatus(): { open: boolean; label: string; breakfast: boolean } {
  const { h, m } = kizlyarNow();
  const t = h + m / 60;
  const open = t >= INFO.open && t < INFO.close;
  if (open) {
    const left = INFO.close - t;
    return {
      open,
      breakfast: t < 14,
      label: left <= 1 ? "Скоро закроемся, до 23:00" : "Открыто до 23:00",
    };
  }
  return { open, breakfast: false, label: "Закрыто, откроемся в 10:00" };
}
