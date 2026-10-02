import React from 'react';

interface BarakaBizzLogoProps {
  className?: string;
  inverted?: boolean;
  color?: string;
}

export const BarakaBizzLogo: React.FC<BarakaBizzLogoProps> = ({
  className = 'h-9 w-auto',
  inverted = false,
  color
}) => {
  const fillColor = color ? color : inverted ? '#FAF8F5' : '#141413';

  return (
    <svg
      viewBox="0 0 540 260"
      className={`inline-block transition-colors duration-200 select-none ${className}`}
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BARAKA Bizz."
    >
      <g className="baraka-bizz-brand-vector">
        {/* GIANT CONNECTED DOUBLE-B BLOCK (Left Silhouette) with transparent counters */}
        <path
          d="
            M 45 42 
            C 45 42, 102 38, 142 42 
            C 165 44, 178 58, 175 80 
            C 172 101, 154 114, 134 118 
            C 160 124, 180 142, 177 172 
            C 174 200, 152 216, 120 218 
            C 80 220, 42 218, 38 214 
            C 34 208, 45 42, 45 42 Z

            M 85 64 
            L 132 66 
            C 142 67, 145 78, 141 87 
            C 137 95, 126 98, 114 98 
            L 86 96 
            Z

            M 84 142 
            L 118 143 
            C 136 144, 146 156, 143 172 
            C 140 188, 128 196, 110 196 
            L 83 194 
            Z
          "
          fillRule="evenodd"
        />

        {/* TOP ROW: A R A K A */}
        {/* First 'A' */}
        <g transform="translate(182, 43)">
          <path
            d="
              M 28 0 
              L 42 0 
              L 58 74 
              L 40 75 
              L 35 55 
              L 16 55 
              L 12 75 
              L -5 74 
              Z 
              M 26 18 
              L 18 42 
              L 33 42 
              Z
            "
            fillRule="evenodd"
          />
        </g>

        {/* 'R' */}
        <g transform="translate(244, 43)">
          <path
            d="
              M 0 0 
              L 34 0 
              C 50 1, 56 12, 54 26 
              C 52 38, 42 46, 30 48 
              L 54 75 
              L 36 75 
              L 16 49 
              L 16 75 
              L 0 75 
              Z 
              M 16 14 
              L 16 36 
              L 30 36 
              C 38 36, 40 28, 40 24 
              C 40 18, 36 14, 28 14 
              Z
            "
            fillRule="evenodd"
          />
        </g>

        {/* Second 'A' */}
        <g transform="translate(306, 43)">
          <path
            d="
              M 27 0 
              L 41 0 
              L 58 74 
              L 40 75 
              L 35 55 
              L 16 55 
              L 12 75 
              L -5 74 
              Z 
              M 26 18 
              L 18 42 
              L 33 42 
              Z
            "
            fillRule="evenodd"
          />
        </g>

        {/* 'K' */}
        <g transform="translate(368, 43)">
          <path
            d="
              M 0 0 
              L 16 0 
              L 16 30 
              L 40 0 
              L 58 0 
              L 28 36 
              L 60 75 
              L 40 75 
              L 16 43 
              L 16 75 
              L 0 75 
              Z
            "
          />
        </g>

        {/* Third 'A' */}
        <g transform="translate(430, 43)">
          <path
            d="
              M 27 0 
              L 41 0 
              L 58 74 
              L 40 75 
              L 35 55 
              L 16 55 
              L 12 75 
              L -5 74 
              Z 
              M 26 18 
              L 18 42 
              L 33 42 
              Z
            "
            fillRule="evenodd"
          />
        </g>

        {/* BOTTOM ROW: I Z Z . (Next to second B, beneath ARAKA) */}
        {/* 'I' */}
        <g transform="translate(186, 142)">
          <path
            d="
              M 0 0 
              L 16 0 
              L 15 72 
              L -1 72 
              Z
            "
          />
        </g>

        {/* First 'Z' */}
        <g transform="translate(210, 142)">
          <path
            d="
              M 0 0 
              L 46 0 
              L 46 16 
              L 18 56 
              L 48 56 
              L 48 72 
              L -1 72 
              L -1 56 
              L 26 16 
              L 0 16 
              Z
            "
          />
        </g>

        {/* Second 'Z' */}
        <g transform="translate(266, 142)">
          <path
            d="
              M 0 0 
              L 46 0 
              L 46 16 
              L 18 56 
              L 48 56 
              L 48 72 
              L -1 72 
              L -1 56 
              L 26 16 
              L 0 16 
              Z
            "
          />
        </g>

        {/* '.' (Dot / Period) */}
        <g transform="translate(322, 186)">
          <circle cx="12" cy="14" r="13" />
        </g>
      </g>
    </svg>
  );
};

// Backwards compatibility alias
export const BarakaDizzLogo = BarakaBizzLogo;
