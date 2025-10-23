import React from 'react';

export const PiyushGokheLogo: React.FC = () => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Piyush Gokhe Logo"
      className="group-hover:opacity-80 transition-opacity"
    >
      <defs>
        <linearGradient id="pg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#c084fc' }} /> {/* purple-400 */}
          <stop offset="100%" style={{ stopColor: '#22d3ee' }} /> {/* cyan-400 */}
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#pg-gradient)" />
      <text 
        x="50" 
        y="55" 
        fontFamily="Verdana, Geneva, sans-serif"
        fontSize="50" 
        fill="#0f172a" /* slate-900 for high contrast */
        textAnchor="middle" 
        dominantBaseline="middle"
        fontWeight="bold"
      >
        <tspan dx="-2">P</tspan><tspan dx="-4">G</tspan>
      </text>
    </svg>
  );
};