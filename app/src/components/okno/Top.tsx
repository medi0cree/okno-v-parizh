import { useEffect, useState } from "react";
import { INFO, openStatus } from "../../lib/okno";
import { IconPhone } from "./icons";

export function Shutters() {
  return (
    <>
      <div className="shutters" aria-hidden="true">
        <div className="shutter" />
        <div className="shutter r" />
      </div>
      <div className="shutter-mark" aria-hidden="true">
        Bonjour, Кизляр
      </div>
    </>
  );
}

export function useOpenStatus() {
  const [st, setSt] = useState<{ open: boolean; label: string; breakfast: boolean } | null>(null);
  useEffect(() => {
    const upd = () => setSt(openStatus());
    upd();
    const id = window.setInterval(upd, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return st;
}

export function Nav() {
  const st = useOpenStatus();
  return (
    <header className="nav">
      <a href="#top" className="flex items-center gap-3" aria-label="Окно в Париж, наверх">
        <WindowMark />
        <span className="f-display text-[22px] italic leading-none text-[var(--paper)]">Окно в Париж</span>
      </a>
      <nav className="navlinks hidden items-center gap-1 md:flex" aria-label="Разделы">
        <a className="navlink" href="#menu">Меню</a>
        <a className="navlink" href="#signature">Коронные</a>
        <a className="navlink" href="#bar">Бар</a>
        <a className="navlink" href="#banket">Банкеты</a>
        <a className="navlink" href="#visit">Контакты</a>
      </nav>
      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-2 text-[12px] text-[var(--zinc)] sm:inline-flex">
          <span className={`status-dot ${st?.open ? "on" : ""}`} />
          {st ? st.label : "Ежедневно 10:00–23:00"}
        </span>
        <a className="nav-call" href={INFO.phoneHref}>
          <IconPhone size={15} />
          <span className="hidden sm:inline">Позвонить</span>
        </a>
      </div>
    </header>
  );
}

export function WindowMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5 29V13C5 6.9 9.9 3 16 3s11 3.9 11 10v16H5Z" stroke="#F4C95D" strokeWidth="2" />
      <path d="M16 3v26M5 16h22" stroke="#F4C95D" strokeWidth="1.6" />
      <path d="M19 24l2-9 2 9M20 20.5h2" stroke="#D6453D" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8 26l3-5 2 2 2-3" stroke="#C9D4DE" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
