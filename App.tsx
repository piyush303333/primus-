import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { PromptInput } from './components/PromptInput';
import { ResponseDisplay } from './components/ResponseDisplay';
import { ConversationHistory } from './components/ConversationHistory';
import { getAiResponse } from './services/geminiService';
import * as historyService from './services/historyService';
import { usePdfDownloader } from './hooks/usePdfDownloader';
import { Conversation } from './types';
import { PiyushGokheLogo } from './components/PiyushGokheLogo';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSelectingConversation, setIsSelectingConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setConversations(historyService.getConversations());
  }, []);

  const currentConversation = useMemo(() => 
    conversations.find(c => c.id === currentConversationId),
    [conversations, currentConversationId]
  );

  const conversationRef = useRef<HTMLDivElement>(null);
  const { downloadPdf, isDownloading } = usePdfDownloader(conversationRef);

  const handleSubmit = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt.trim() || isLoading) return;

    setIsLoading(true);
    setIsTyping(false);
    setError(null);
    setCurrentConversationId(null); 
    setPrompt(currentPrompt);

    try {
      const aiResponse = await getAiResponse(currentPrompt);
      const newConversation: Conversation = {
        id: Date.now().toString(),
        prompt: currentPrompt,
        response: aiResponse,
        timestamp: Date.now(),
      };
      
      const updatedConversations = [newConversation, ...conversations];
      setConversations(updatedConversations);
      historyService.saveConversations(updatedConversations);
      setCurrentConversationId(newConversation.id);
      setIsTyping(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  }, [isLoading, conversations]);

  const handleSelectConversation = (id: string) => {
    if (isSelectingConversation) return;

    setIsSidebarOpen(false); // Close sidebar on selection
    setIsSelectingConversation(id);
    setIsTyping(false);
    setError(null);

    // Simulate loading for better UX feedback
    setTimeout(() => {
      setCurrentConversationId(id);
      setIsSelectingConversation(null);
    }, 300);
  };

  const handleNewChat = () => {
    setIsSidebarOpen(false);
    setCurrentConversationId(null);
    setIsTyping(false);
    setError(null);
    setPrompt('');
    setIsSelectingConversation(null);
  };
  
  const handleDownloadPdf = useCallback(() => {
    if (!currentConversation) return;
    downloadPdf(currentConversation.prompt);
  }, [currentConversation, downloadPdf]);
  
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all conversation history? This action cannot be undone.')) {
      historyService.clearConversations();
      setConversations([]);
      handleNewChat();
    }
  };

  const isActionDisabled = !currentConversation || isLoading || isTyping || isDownloading;

  return (
    <div className="relative min-h-screen font-sans">
      <ConversationHistory
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
        isSelectingId={isSelectingConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="lg:pl-64 flex flex-col h-screen">
        <header className="flex-shrink-0 w-full">
            <div className="max-w-4xl mx-auto flex items-center gap-2 p-4 sm:p-6 lg:py-8">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-slate-300 hover:bg-slate-700/50"
                aria-label="Open conversation history"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex-grow text-center">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 pb-2">
                  AI Content Generator
                </h1>
                <p className="text-slate-300 mt-2 text-xs sm:text-base">
                  Select a past conversation or start a new one.
                </p>
              </div>
            </div>
        </header>

        <main className="flex-grow w-full max-w-4xl mx-auto overflow-y-auto bg-slate-800/30 rounded-2xl shadow-2xl backdrop-blur-xl border border-slate-700/50">
          <div className="p-4 sm:p-6">
            <ResponseDisplay 
              ref={conversationRef}
              prompt={currentConversation?.prompt ?? (isLoading ? prompt : '')} 
              response={currentConversation?.response ?? ''} 
              isLoading={isLoading && !currentConversation} 
              error={error}
              onTypingComplete={() => setIsTyping(false)}
              onDownloadPdf={handleDownloadPdf}
              isPdfDownloading={isDownloading}
              isPdfDisabled={isActionDisabled}
            />
          </div>
        </main>

        <footer className="w-full max-w-4xl mx-auto flex-shrink-0 p-4 sm:px-6 lg:pb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleSubmit}
                isLoading={isLoading || isTyping}
              />
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 text-xs text-slate-400 pt-4">
            <span>Created by</span>
            <a href="https://www.webo.online" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
              <PiyushGokheLogo />
              <span className="font-semibold group-hover:text-cyan-400 transition-colors">Piyush Gokhe</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;