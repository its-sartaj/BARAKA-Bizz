import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  category?: string;
  fallbackClass?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackTitle,
  category,
  className = '',
  fallbackClass = 'from-[#2A2927] to-[#171615]',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${fallbackClass} flex flex-col items-center justify-center p-6 text-center text-[#EAE6DF] select-none relative overflow-hidden ${className}`}
      >
        {/* Subtle geometric background watermark lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-3 text-amber-200/80">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
          <span className="text-[11px] tracking-[0.2em] uppercase text-white/50 mb-1">
            BARAKA Bizz. ATELIER
          </span>
          <span className="text-sm font-medium text-white/90 line-clamp-1 max-w-[200px]">
            {fallbackTitle || alt || 'Artisanal Piece'}
          </span>
          {category && (
            <span className="text-xs text-amber-300/70 mt-1 font-mono">{category}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#EFECE6] animate-pulse" />
      )}
      <img
        src={src}
        alt={alt || 'BARAKA Bizz. Apparel'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
