
import React from 'react';

interface DownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
  isDownloading: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, disabled, isDownloading }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center bg-slate-700 text-slate-200 font-semibold py-3 px-5 rounded-full hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 mr-2 ${isDownloading ? 'animate-spin' : ''}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        {isDownloading ? (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 102 0V5z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        )}
      </svg>
      {isDownloading ? '...' : 'PDF'}
    </button>
  );
};
