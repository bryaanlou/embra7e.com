type Props = {
  size?: number;
  className?: string;
};

const ANGLES = [0, 60, 120, 180, 240, 300];

export function Logo({ size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(50 50)">
        {ANGLES.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <line x1="0" y1="-6" x2="0" y2="-40" />
            <line x1="0" y1="-18" x2="-8" y2="-26" />
            <line x1="0" y1="-18" x2="8" y2="-26" />
            <line x1="0" y1="-28" x2="-5" y2="-33" />
            <line x1="0" y1="-28" x2="5" y2="-33" />
            <path d="M 0 -40 Q -3 -42 -5 -39" />
          </g>
        ))}
        <circle cx="0" cy="0" r="2.5" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
