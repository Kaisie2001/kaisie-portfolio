type IconProps = {
  color?: string;
};

export function GdIconRain() {
  return (
    <svg viewBox="0 0 16 16" width={13} height={13} aria-hidden>
      <path d="M5 11.7a3 3 0 0 1-.4-5.97 4 4 0 0 1 7.63 1.1A2.5 2.5 0 0 1 11.5 11.7H5Z" fill="currentColor" opacity="0.9" />
      <path d="M5.4 13.2 4.8 15M8 13.2 7.4 15M10.6 13.2 10 15" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function GdIconLocate() {
  return (
    <svg viewBox="0 0 20 20" width={15} height={15} aria-hidden>
      <path d="M10 2v3M10 15v3M2 10h3M15 10h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="10" r="4.3" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function GdIconPin({ color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" width={15} height={15} aria-hidden>
      <path d="M9 1.8a5 5 0 0 0-5 5c0 3.7 5 9.4 5 9.4s5-5.7 5-9.4a5 5 0 0 0-5-5Z" fill={color} />
      <circle cx="9" cy="6.8" r="1.7" fill="#fff" />
    </svg>
  );
}

export function GdIconPinTeal() {
  return <GdIconPin color="#00a8b5" />;
}

export function GdIconTargetBlue() {
  return (
    <svg viewBox="0 0 18 18" width={15} height={15} aria-hidden>
      <circle cx="9" cy="9" r="6.5" fill="#e6f4ff" stroke="#1677ff" strokeWidth="1.4" />
      <circle cx="9" cy="9" r="2.4" fill="#1677ff" />
    </svg>
  );
}

export function GdIconInfoBlue() {
  return (
    <svg viewBox="0 0 18 18" width={15} height={15} aria-hidden>
      <circle cx="9" cy="9" r="7" fill="#e6f4f9" />
      <path d="M9 8.2v4.2M9 5.6h.01" stroke="#1a6fb5" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function GdIconBack() {
  return (
    <svg viewBox="0 0 18 18" width={16} height={16} aria-hidden>
      <path d="M11 4 6 9l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function GdIconClock() {
  return (
    <svg viewBox="0 0 18 18" width={15} height={15} aria-hidden>
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M9 5.3V9l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function GdIconPeople() {
  return (
    <svg viewBox="0 0 18 18" width={15} height={15} aria-hidden>
      <circle cx="6.7" cy="6.5" r="2.2" fill="currentColor" opacity="0.8" />
      <circle cx="12" cy="7.2" r="1.8" fill="currentColor" opacity="0.45" />
      <path d="M3.5 14c.6-2 1.9-3 3.2-3 1.4 0 2.7 1 3.3 3H3.5ZM9.8 14c.4-1.4 1.2-2.1 2.2-2.1s1.9.7 2.5 2.1H9.8Z" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

export function GdIconCar() {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} aria-hidden>
      <path d="M4 8.3 5.2 5c.2-.6.8-1 1.4-1h6.8c.6 0 1.2.4 1.4 1L16 8.3l1 1.2v4.4h-2v-1.2H5v1.2H3V9.5l1-1.2Z" fill="currentColor" />
      <path d="M5.5 8h9L13.7 5.8H6.3L5.5 8Z" fill="#fff" opacity="0.8" />
      <circle cx="6.3" cy="10.7" r="1" fill="#fff" />
      <circle cx="13.7" cy="10.7" r="1" fill="#fff" />
    </svg>
  );
}

export function GdIconCloud() {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} aria-hidden>
      <path d="M6 14.5a3 3 0 0 1-.3-6A4.3 4.3 0 0 1 14 8.2a3.2 3.2 0 0 1-.8 6.3H6Z" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

export function GdIconAlertGray() {
  return (
    <svg viewBox="0 0 18 18" width={15} height={15} aria-hidden>
      <path d="M9 2 16 15H2L9 2Z" fill="#f2f2f7" stroke="#8e8e93" strokeWidth="1.2" />
      <path d="M9 6.2v4.2M9 12.8h.01" stroke="#636366" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function GdIconRoad() {
  return (
    <svg viewBox="0 0 18 18" width={15} height={15} aria-hidden>
      <path d="M7 2 4.2 16M11 2l2.8 14M9 3v2M9 7v2M9 11v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function GdIconWalk() {
  return (
    <svg viewBox="0 0 18 18" width={15} height={15} aria-hidden>
      <circle cx="9.8" cy="3.5" r="1.7" fill="currentColor" />
      <path d="m8.8 6.2-1.6 3.1 2.2 1.5-1.5 4M10 7.2l1.5 2.5 2.2.7M8.2 9.4 5.7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function GdIconUmbrella() {
  return (
    <svg viewBox="0 0 18 18" width={15} height={15} aria-hidden>
      <path d="M2.5 8.2a6.5 6.5 0 0 1 13 0H2.5Z" fill="currentColor" opacity="0.75" />
      <path d="M9 8.2v5.2a2 2 0 0 0 3 1.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function GdIconCheckBadge() {
  return (
    <svg viewBox="0 0 18 18" width={15} height={15} aria-hidden>
      <circle cx="9" cy="9" r="7" fill="#e8f6ec" />
      <path d="m5.8 9.3 2.1 2.1 4.5-5" stroke="#34a853" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
