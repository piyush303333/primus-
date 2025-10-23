import React, { useState } from 'react';

interface CopyToClipboardButtonProps {
  textToCopy: string;
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy || isCopied) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text.');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center space-x-2 px-3 py-1.5 text-xs rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-cyan-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Copy AI response to clipboard"
      disabled={isCopied}
    >
      {isCopied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Copy Text</span>
        </>
      )}
    </button>
  );
};