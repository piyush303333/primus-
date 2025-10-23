import React from 'react';

interface DownloadPdfButtonProps {
  onClick: () => void;
  disabled: boolean;
  isDownloading: boolean;
}

export const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({ onClick, disabled, isDownloading }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center space-x-2 px-3 py-1.5 text-xs rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-cyan-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Save conversation view as PDF"
    >
      {isDownloading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Saving...</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Save View as PDF</span>
        </>
      )}
    </button>
  );
};