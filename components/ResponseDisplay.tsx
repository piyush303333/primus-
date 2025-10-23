import React, { useEffect } from 'react';
import { CopyToClipboardButton } from './CopyToClipboardButton';
import { useTypewriter } from '../hooks/useTypewriter';
import { DownloadResponseButton } from './DownloadResponseButton';
import { DownloadPdfButton } from './DownloadPdfButton';

interface ResponseDisplayProps {
  prompt: string;
  response: string;
  isLoading: boolean;
  error: string | null;
  onTypingComplete: () => void;
  onDownloadPdf: () => void;
  isPdfDownloading: boolean;
  isPdfDisabled: boolean;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center" aria-label="Loading response">
    <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span className="text-slate-400 ml-3">Generating response...</span>
  </div>
);

const ResponseDisplayComponent: React.ForwardRefRenderFunction<HTMLDivElement, ResponseDisplayProps> = 
  ({ prompt, response, isLoading, error, onTypingComplete, onDownloadPdf, isPdfDownloading, isPdfDisabled }, ref) => {
    const { displayText, isFinished } = useTypewriter(response, 20);

    useEffect(() => {
      if (isFinished) {
        onTypingComplete();
      }
    }, [isFinished, onTypingComplete]);
    
    const hasContent = prompt || response || isLoading || error;

    if (!hasContent) {
      return (
        <div className="text-center text-slate-400 min-h-[200px] flex items-center justify-center">
          <p>Your AI-generated response will appear here. Start a new chat below.</p>
        </div>
      );
    }

    return (
      <div ref={ref} className="min-h-[200px] space-y-6">
          {prompt && (
            <div className="bg-slate-700/50 p-4 rounded-lg animate-fade-in-up">
                <h2 className="text-lg font-semibold text-cyan-400 mb-2">Your Prompt</h2>
                <p className="text-slate-300 whitespace-pre-wrap">{prompt}</p>
            </div>
          )}

        {isLoading && <LoadingSpinner />}
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg animate-fade-in-up">
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-slate-900/50 p-4 rounded-lg animate-fade-in-up">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-2">
                <h2 className="text-lg font-semibold text-purple-400">AI Response</h2>
                <div className="flex items-center space-x-2">
                  <DownloadPdfButton onClick={onDownloadPdf} isDownloading={isPdfDownloading} disabled={isPdfDisabled} />
                  <DownloadResponseButton textToDownload={response} prompt={prompt} />
                  <CopyToClipboardButton textToCopy={response} />
                </div>
              </div>
              <div className="prose prose-invert max-w-none text-slate-200 whitespace-pre-wrap">
                {displayText}
                {!isFinished && <span className="cursor-blink">|</span>}
              </div>
          </div>
        )}
      </div>
    );
};

export const ResponseDisplay = React.forwardRef(ResponseDisplayComponent);
ResponseDisplay.displayName = 'ResponseDisplay';