type P = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const IconPhone = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 4h3.5l1.8 4.4-2.2 1.4a11 11 0 0 0 6.1 6.1l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" />
  </svg>
);
export const IconSearch = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);
export const IconDice = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <circle cx="9" cy="9" r="1.1" fill="currentColor" />
    <circle cx="15" cy="15" r="1.1" fill="currentColor" />
    <circle cx="15" cy="9" r="1.1" fill="currentColor" />
    <circle cx="9" cy="15" r="1.1" fill="currentColor" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" />
  </svg>
);
export const IconPlus = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconCheck = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const IconClose = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconArrow = ({ size = 20, className, dir = "right" }: P & { dir?: "left" | "right" }) => (
  <svg {...base(size)} className={className} style={{ transform: dir === "left" ? "scaleX(-1)" : undefined }}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);
export const IconPin = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const IconClock = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const IconStar = ({ size = 16, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3Z"
    />
  </svg>
);
export const IconChat = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 19.5 5.3 16A8 8 0 1 1 8 18.7L4 19.5Z" />
  </svg>
);

/** Иконки вкусов: собственные линейные рисунки */
export const TagIcon = ({ tag, size = 16 }: { tag: string; size?: number }) => {
  const s = base(size);
  switch (tag) {
    case "meat":
      return (
        <svg {...s}>
          <path d="M14.5 4.5c3 0 5 2.2 5 5 0 4-4.5 7-8.5 7-1.2 0-2 .4-2.7 1.1L6.5 19.4a1.8 1.8 0 1 1-2.4-2.4l1.9-1.8c.7-.7 1-1.5 1-2.6 0-4 3.4-8.1 7.5-8.1Z" />
        </svg>
      );
    case "fish":
      return (
        <svg {...s}>
          <path d="M3 12c3-4.5 7-6 11-4.5L21 5v14l-7-2.5C10 18 6 16.5 3 12Z" />
          <circle cx="8" cy="11" r=".8" fill="currentColor" />
        </svg>
      );
    case "light":
      return (
        <svg {...s}>
          <path d="M5 19C5 10 11 5 20 4c-1 9-6 15-15 15Z" />
          <path d="M5 19 13 11" />
        </svg>
      );
    case "hearty":
      return (
        <svg {...s}>
          <path d="M3 12h18a9 9 0 0 1-18 0Z" />
          <path d="M8 8c0-1.5 1-1.5 1-3M12 8c0-1.5 1-1.5 1-3M16 8c0-1.5 1-1.5 1-3" />
        </svg>
      );
    case "spicy":
      return (
        <svg {...s}>
          <path d="M16 6c-1-2 0-3 2-3M16 6c3 1 4 5 1 8-3 3-8 6-13 6 4-2 6-6 6-9s3-6 6-5Z" />
        </svg>
      );
    case "veg":
      return (
        <svg {...s}>
          <path d="M12 21c-5-1-8-5-8-10 4 0 7 2 8 5 1-3 4-5 8-5 0 5-3 9-8 10Z" />
          <path d="M12 16V4" />
        </svg>
      );
    case "sweet":
      return (
        <svg {...s}>
          <path d="M4 14h16l-2 6H6l-2-6Z" />
          <path d="M6 14a6 6 0 0 1 12 0M12 4v4" />
        </svg>
      );
    case "share":
      return (
        <svg {...s}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v16M4.5 9h15M4.5 15h15" />
        </svg>
      );
    case "dag":
      return (
        <svg {...s}>
          <path d="M2 19 8 8l4 6 3-4 7 9H2Z" />
          <path d="m6.5 11 1.5 1.5 1.5-1.5" />
        </svg>
      );
    case "euro":
      return (
        <svg {...s}>
          <path d="M12 3 8 21M12 3l4 18M9.5 14h5M10.6 9h2.8" />
        </svg>
      );
    case "breakfast":
      return (
        <svg {...s}>
          <circle cx="12" cy="13" r="7" />
          <circle cx="13" cy="12" r="2.5" />
          <path d="M5 5l2 2M19 5l-2 2M12 2v2" />
        </svg>
      );
    default:
      return null;
  }
};
