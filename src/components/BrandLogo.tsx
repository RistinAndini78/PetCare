import React from 'react';

interface BrandLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xl';
  className?: string;
}

const sizeMap: Record<NonNullable<BrandLogoProps['size']>, string> = {
  small: 'w-10 h-10',    // 40px sidebar
  medium: 'w-14 h-14',  // 56px user login
  large: 'w-18 h-18',   // 72px admin login  
  xl: 'w-20 h-20',      // 80px home page
};

export default function BrandLogo({ size = 'xl', className = '' }: BrandLogoProps) {
  return (
    <div 
      className={`
        ${sizeMap[size]} 
        ${className}
        flex items-center justify-center
        bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600
        rounded-2xl shadow-2xl shadow-purple-500/30
        border border-purple-400/30
        relative overflow-hidden
      `}
    >
      <svg 
        width="60%" 
        height="60%" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5"
        className="drop-shadow-lg"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 3.33-1 4.5s3.24 .5 4.5-1M19.5 16.5c1.5 1.26 2 3.33 1 4.5s-3.24 .5-4.5-1M12 18c-2.5 0-4.5 2-4.5 4.5S9.5 27 12 27s4.5-2 4.5-4.5S14.5 18 12 18z"/>
        <circle cx="7" cy="7" r="3"/>
        <circle cx="17" cy="7" r="3"/>
        <circle cx="12" cy="11" r="3"/>
      </svg>
    </div>
  );
}

