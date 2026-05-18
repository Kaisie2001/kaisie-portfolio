export function IconRain() {
  return (
    <svg width={10} height={8} viewBox="0 0 16 12" fill="none" aria-hidden>
      <path
        d="M4 8a3 3 0 015.8-1 2.5 2.5 0 014.2 2.5H14a2 2 0 010 4H4a2.5 2.5 0 010-5.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconSearch({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
      aria-hidden
      className="figma-pickup-search-icon"
    >
      <path
        d="M512 858.3168c-194.816 0-352-166.2464-352-370.4832S317.184 117.3504 512 117.3504s352 166.2464 352 370.4832-157.184 370.4832-352 370.4832z m0-64c158.6688 0 288-136.8576 288-306.4832 0-169.6768-129.3312-306.4832-288-306.4832S224 318.1568 224 487.8336c0 169.6256 129.3312 306.4832 288 306.4832zM717.312 799.9488a32 32 0 0 1 46.4896-43.9808l91.4432 96.7168a32 32 0 0 1-46.4896 43.9808l-91.4432-96.768z"
        fill="#8a8a8a"
      />
    </svg>
  );
}

export function IconBack() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M10 3L5 8l5 5"
        stroke="#1c1c1e"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPinTeal() {
  return (
    <svg width={15} height={15} viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 1.5C6.5 1.5 4.5 3.5 4.5 6c0 4.5 4.5 10.5 4.5 10.5S13.5 10.5 13.5 6c0-2.5-2-4.5-4.5-4.5z"
        fill="#00a9b5"
      />
      <circle cx={9} cy={6} r={1.8} fill="#fff" />
    </svg>
  );
}

export function IconTargetBlue() {
  return (
    <svg width={15} height={15} viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx={9} cy={9} r={6} stroke="#00a9b5" strokeWidth={1.3} />
      <circle cx={9} cy={9} r={2.2} fill="#00a9b5" />
    </svg>
  );
}

export function IconInfoBlue() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden>
      <circle cx={7} cy={7} r={7} fill="#1a6fb5" />
      <text x={7} y={10} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="bold">
        i
      </text>
    </svg>
  );
}

export function IconInfoGray() {
  return (
    <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden>
      <circle cx={5} cy={5} r={5} fill="#aeaeb2" />
      <text x={5} y={7} textAnchor="middle" fill="#fff" fontSize={7} fontWeight="bold">
        i
      </text>
    </svg>
  );
}

export function IconAlertGray() {
  return (
    <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden>
      <circle cx={6} cy={6} r={6} fill="#aeaeb2" />
      <text x={6} y={8.5} textAnchor="middle" fill="#fff" fontSize={8} fontWeight="bold">
        !
      </text>
    </svg>
  );
}

export function IconChart() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 12V7M7 12V4M11 12V9M14 12H2"
        stroke="#8e8e93"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconClock() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx={8} cy={8} r={6} stroke="#8e8e93" strokeWidth={1.2} />
      <path d="M8 5v3l2 1.5" stroke="#8e8e93" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}

export function IconCloud() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 10a3 3 0 015.5-1.5A2.5 2.5 0 0112 10H4z"
        stroke="#f5a623"
        strokeWidth={1.2}
        fill="none"
      />
    </svg>
  );
}

export function IconPeople() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx={6} cy={5} r={2} fill="#8e8e93" />
      <circle cx={11} cy={6} r={1.5} fill="#8e8e93" />
      <path d="M2 13c0-2 2.5-3 4-3s4 1 4 3" stroke="#8e8e93" strokeWidth={1} />
    </svg>
  );
}

export function IconCar() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 10l1.5-4h9L14 10" stroke="#8e8e93" strokeWidth={1.2} />
      <circle cx={5} cy={12} r={1} fill="#8e8e93" />
      <circle cx={11} cy={12} r={1} fill="#8e8e93" />
    </svg>
  );
}

export function IconCarTeal() {
  return (
    <svg width={18} height={18} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 10l1.5-4h9L14 10" stroke="#00a8b5" strokeWidth={1.2} />
      <circle cx={5} cy={12} r={1} fill="#00a8b5" />
      <circle cx={11} cy={12} r={1} fill="#00a8b5" />
    </svg>
  );
}

export function IconWalk() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx={8} cy={3} r={1.5} fill="#8e8e93" />
      <path d="M6 6h4l-1 4 2 3H7L5 9V6z" fill="#8e8e93" />
    </svg>
  );
}

export function IconUmbrella() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8a5 5 0 0110 0H3z" stroke="#34a853" strokeWidth={1.2} />
      <path d="M8 8v5" stroke="#34a853" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}

export function IconRoad() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5 2l-2 12M11 2l2 12M6 6h4" stroke="#8e8e93" strokeWidth={1} />
    </svg>
  );
}

export function IconCheck() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8.5 6.5 12 13 4"
        stroke="#34a853"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Green circle + white check (Figma banner-valid) */
export function IconCheckBadge() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx={12} cy={12} r={10} fill="#34a853" />
      <path
        d="M8 12l3 3 5-6"
        stroke="#fff"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPin({
  color,
  size = 20,
}: {
  color: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="figma-pin-icon"
    >
      <path
        d="M8 1C5.8 1 4 2.8 4 5c0 3.5 4 9 4 9s4-5.5 4-9c0-2.2-1.8-4-4-4z"
        fill={color}
      />
      <circle cx={8} cy={5} r={1.5} fill="#fff" />
    </svg>
  );
}

/** GPS / recenter on current location */
export function IconLocateCurrent() {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 1024 1024"
      fill="none"
      aria-hidden
      className="figma-icon-locate"
    >
      <path
        d="M473 71a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v77.161C722.848 166.622 857.812 301.289 876.729 471H952a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-75.053C858.871 721.652 723.515 857.305 553 875.839V951a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-75.161C302.818 857.341 167.659 722.182 149.161 552H72a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h77.161C167.659 301.818 302.818 166.659 473 148.161V71z m326 441c0-157.953-128.047-286-286-286S227 354.047 227 512s128.047 286 286 286 286-128.047 286-286z m-286 60c33.137 0 60-26.863 60-60s-26.863-60-60-60-60 26.863-60 60 26.863 60 60 60z"
        fill="#8a8a8a"
      />
    </svg>
  );
}
