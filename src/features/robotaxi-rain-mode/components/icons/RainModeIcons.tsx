type IconProps = { className?: string; color?: string };

export function BackIcon({ className = "h-4 w-4", color = "#1c1c1e" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M10 3 5 8l5 5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RainCloudIcon({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 12" fill="none" aria-hidden>
      <path
        d="M4 8a3 3 0 015.8-1 2.5 2.5 0 014.2 2.5H14a2 2 0 010 4H4a2.5 2.5 0 010-5.5z"
        fill="currentColor"
      />
      <path d="M6 11v1M9 11v1M12 11v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function ProfileIcon({ className = "h-4 w-4", color = "#8e8e93" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx={8} cy={5.5} r={2.5} stroke={color} strokeWidth={1.2} />
      <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}

export function MoreIcon({ className = "h-4 w-4", color = "#8e8e93" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx={4} cy={8} r={1.2} fill={color} />
      <circle cx={8} cy={8} r={1.2} fill={color} />
      <circle cx={12} cy={8} r={1.2} fill={color} />
    </svg>
  );
}

export function PinTealIcon({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 1.5C6.5 1.5 4.5 3.5 4.5 6c0 4.5 4.5 10.5 4.5 10.5S13.5 10.5 13.5 6c0-2.5-2-4.5-4.5-4.5z"
        fill="#00a8b5"
      />
      <circle cx={9} cy={6} r={1.8} fill="#fff" />
    </svg>
  );
}

export function TargetTealIcon({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx={9} cy={9} r={6} stroke="#00a8b5" strokeWidth={1.3} />
      <circle cx={9} cy={9} r={2.2} fill="#00a8b5" />
    </svg>
  );
}

export function TargetIcon({ className = "h-[18px] w-[18px]" }: IconProps) {
  return <TargetTealIcon className={className} />;
}

export function SearchGrayIcon({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx={8} cy={8} r={5} stroke="#8e8e93" strokeWidth={1.3} />
      <path d="M12 12l4 4" stroke="#8e8e93" strokeWidth={1.3} strokeLinecap="round" />
    </svg>
  );
}

export function InfoCircleIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 14 14" aria-hidden>
      <circle cx={7} cy={7} r={7} fill="#1a6fb5" />
      <text x={7} y={10} textAnchor="middle" fill="white" fontSize={9} fontWeight="bold">
        i
      </text>
    </svg>
  );
}

export function PinIcon({ color = "#34a853", className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1C5.8 1 4 2.8 4 5c0 3.5 4 9 4 9s4-5.5 4-9c0-2.2-1.8-4-4-4z"
        fill={color}
      />
      <circle cx={8} cy={5} r={1.5} fill="#fff" />
    </svg>
  );
}

export function ClockIcon({ className = "h-4 w-4", color = "#8e8e93" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx={8} cy={8} r={6} stroke={color} strokeWidth={1.2} />
      <path d="M8 5v3l2 1.5" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}

export function ClockOrangeIcon({ className = "h-4 w-4" }: IconProps) {
  return <ClockIcon className={className} color="#f5a623" />;
}

export function PeopleIcon({ className = "h-4 w-4", color = "#8e8e93" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx={6} cy={5} r={2} fill={color} />
      <circle cx={11} cy={6} r={1.5} fill={color} />
      <path d="M2 13c0-2 2.5-3 4-3s4 1 4 3" stroke={color} strokeWidth={1} />
    </svg>
  );
}

export function CarIcon({ className = "h-4 w-4", color = "#8e8e93" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 10l1.5-4h9L14 10M4 10v2h8v-2"
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <circle cx={5} cy={12} r={1} fill={color} />
      <circle cx={11} cy={12} r={1} fill={color} />
    </svg>
  );
}

export function CarTealIcon({ className = "h-5 w-5" }: IconProps) {
  return <CarIcon className={className} color="#00a8b5" />;
}

export function ChartIcon({ className = "h-4 w-4", color = "#8e8e93" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 12V7M7 12V4M11 12V9M14 12H2"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WalkIcon({ className = "h-4 w-4", color = "#8e8e93" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx={8} cy={3} r={1.5} fill={color} />
      <path d="M6 6h4l-1 4 2 3H7L5 9V6z" fill={color} />
    </svg>
  );
}

export function UmbrellaIcon({ className = "h-4 w-4", color = "#8e8e93" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8a5 5 0 0110 0H3zm5 0v5"
        stroke={color}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TreeIcon({ className = "h-4 w-4", color = "#8e8e93" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2l3 4H5l3-4zM6 6h4v2H6V6zM8 8v6" stroke={color} strokeWidth={1} />
    </svg>
  );
}

export function RoadIcon({ className = "h-4 w-4", color = "#8e8e93" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M5 2l-2 12M11 2l2 12M6 6h4M5.5 10h5"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = "h-3.5 w-3.5", color = "#34a853" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8.5 6.5 12 13 4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RainSmallIcon({ className = "h-2.5 w-2.5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 12 10" fill="none" aria-hidden>
      <path
        d="M2 7a2.5 2.5 0 014.5-1A2 2 0 0110 7H2z"
        fill="#8e8e93"
      />
    </svg>
  );
}
