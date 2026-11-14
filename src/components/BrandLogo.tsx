import React from 'react';

interface BrandLogoProps {
  variant?: 'header' | 'card';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'header', className = '' }) => {
  if (variant === 'card') {
    return (
      <div className={`inline-flex flex-col items-start select-none ${className}`}>
        <div className="flex items-baseline gap-2.5">
          <span
            className="font-serif italic font-semibold tracking-wide text-[#C5A880] text-3xl sm:text-4xl leading-none"
            style={{ fontFamily: 'var(--font-serif-brand)' }}
          >
            Natali
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#1A1A1A] uppercase">
            elektro-epil
          </span>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-baseline gap-2 whitespace-nowrap shrink-0 select-none ${className}`}>
      <span
        className="font-serif italic font-semibold text-2xl leading-none text-[#C5A880]"
        style={{ fontFamily: 'var(--font-serif-brand)' }}
      >
        Natali
      </span>
      <span className="text-[13px] font-semibold tracking-[0.18em] text-[#1A1A1A] uppercase">
        elektro-epil
      </span>
    </span>
  );
};
