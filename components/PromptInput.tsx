import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoading && prompt.trim()) {
      onSubmit(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && prompt.trim()) {
        onSubmit(prompt);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your prompt here..."
        className="w-full bg-slate-700/50 text-slate-200 placeholder-slate-400 rounded-full py-3 pl-6 pr-20 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        rows={1}
        disabled={isLoading}
        aria-label="Prompt input"
      />
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 text-white rounded-full h-9 w-9 flex items-center justify-center hover:bg-cyan-400 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
        aria-label="Submit prompt"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </form>
  );
};
