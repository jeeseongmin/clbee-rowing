import React from 'react';

interface BoatSvgProps {
  color: string;
  width?: number;
}

export function BoatSvg({ color, width = 46 }: BoatSvgProps) {
  const h = Math.round(width * 0.44);
  const id = color.replace('#', '');

  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 48 20"
      fill="none"
      style={{ animation: 'boatRock 1.6s ease-in-out infinite' }}
    >
      <defs>
        <filter id={`g${id}`}>
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Wake waves */}
      <path
        d="M1 10.5Q5 6.5 9 9"
        stroke="rgba(147,197,253,.4)"
        strokeWidth="1.3"
        fill="none"
      />
      <path
        d="M0 13Q4 15.5 8 12.5"
        stroke="rgba(147,197,253,.2)"
        strokeWidth=".8"
        fill="none"
      />
      <circle cx="4" cy="14.5" r=".8" fill="rgba(147,197,253,.15)" />
      <circle cx="2" cy="11.5" r=".6" fill="rgba(147,197,253,.12)" />
      {/* Hull */}
      <path
        d="M10 7.2L41 5Q49 9.5 41 14L10 11.8Q6.5 9.5 10 7.2Z"
        fill={color}
        stroke="rgba(0,0,0,.2)"
        strokeWidth=".5"
        filter={`url(#g${id})`}
      />
      {/* Hull highlight */}
      <path
        d="M12 8L38 6.5Q43 8 38 9L12 9.5Q10 8.5 12 8Z"
        fill="rgba(255,255,255,.12)"
      />
      <line
        x1="14"
        y1="9.5"
        x2="38"
        y2="9.5"
        stroke="rgba(255,255,255,.13)"
        strokeWidth=".5"
      />
      {/* Rower head */}
      <circle cx="28" cy="3.8" r="2.5" fill="#fde68a" stroke="#92400e" strokeWidth=".5" />
      <circle cx="27.2" cy="3.5" r=".35" fill="#78350f" />
      <circle cx="28.8" cy="3.5" r=".35" fill="#78350f" />
      {/* Body */}
      <line x1="28" y1="6.3" x2="28" y2="9.5" stroke="#92400e" strokeWidth="1.2" />
      {/* Arms */}
      <line x1="24.5" y1="7.8" x2="31.5" y2="7.8" stroke="#92400e" strokeWidth=".8" />
      {/* Oars */}
      <line x1="31.5" y1="7.8" x2="37" y2="13" stroke="#78716c" strokeWidth=".8" />
      <line x1="24.5" y1="7.8" x2="19" y2="13" stroke="#78716c" strokeWidth=".8" />
      {/* Oar blades */}
      <ellipse cx="38" cy="13.8" rx="2.4" ry="1" fill="#a8a29e" opacity=".85" />
      <ellipse cx="18" cy="13.8" rx="2.4" ry="1" fill="#a8a29e" opacity=".85" />
    </svg>
  );
}
