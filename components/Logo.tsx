
import React from 'react';
import { Handshake } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Shield SVG */}
      <svg 
        viewBox="0 0 24 24" 
        className="w-full h-full text-purple-600 filter drop-shadow-sm" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Shield Body */}
        <path 
          d="M12 2.5L3.5 5.8V11.5C3.5 16.5 7.1 21.1 12 22.4C16.9 21.1 20.5 16.5 20.5 11.5V5.8L12 2.5Z" 
          fill="currentColor" 
          stroke="#e9d5ff" 
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Gloss/Shine Effect for depth */}
        <path 
          d="M12 3.5L4.5 6.4V11.5C4.5 15.8 7.5 19.8 12 20.9V3.5Z" 
          fill="white" 
          fillOpacity="0.15" 
        />
      </svg>

      {/* Handshake Icon */}
      <div className="absolute inset-0 flex items-center justify-center pt-0.5">
         <Handshake size={size * 0.45} className="text-white" strokeWidth={2.5} />
      </div>
    </div>
  );
};
