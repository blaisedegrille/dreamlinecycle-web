export function BikeIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 620"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="230" cy="430" r="150" strokeWidth="14" />
      <circle cx="230" cy="430" r="130" strokeWidth="4" opacity=".55" />
      <circle cx="770" cy="430" r="150" strokeWidth="14" />
      <circle cx="770" cy="430" r="130" strokeWidth="4" opacity=".55" />
      <g strokeWidth="4" opacity=".45">
        <path d="M230 280v300M80 430h300M124 324l212 212M336 324L124 536" />
        <path d="M770 280v300M620 430h300M664 324l212 212M876 324L664 536" />
      </g>
      <path d="M230 430 L470 430 L370 235 L660 220 L680 295 L770 430" />
      <path d="M470 430 L370 235" />
      <path d="M470 430 L680 295" />
      <path d="M370 235 L352 190" />
      <path
        d="M300 182 L410 176 L400 196 L310 200 Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M660 220 L690 170 L770 160" />
      <path d="M770 160 C 820 160 830 205 800 225 C 780 238 762 220 770 205" />
      <circle cx="470" cy="430" r="34" strokeWidth="10" />
      <circle cx="470" cy="430" r="12" fill="currentColor" stroke="none" />
      <circle
        cx="470"
        cy="430"
        r="46"
        strokeWidth="5"
        strokeDasharray="4 6"
        opacity=".7"
      />
      <path d="M470 430 L515 472" />
      <path d="M500 478 L535 462" strokeWidth="18" />
      <path d="M470 396 L230 410" strokeWidth="5" />
      <path d="M470 464 L230 450" strokeWidth="5" />
      <circle cx="230" cy="430" r="26" strokeWidth="8" />
    </svg>
  );
}
