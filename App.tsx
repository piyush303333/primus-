import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { PromptInput } from './components/PromptInput';
import { ResponseDisplay } from './components/ResponseDisplay';
import { ConversationHistory } from './components/ConversationHistory';
import { getAiResponse } from './services/geminiService';
import * as historyService from './services/historyService';
import { Conversation } from './types';
import { RealTimeClock } from './components/RealTimeClock';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSelectingConversation, setIsSelectingConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    setConversations(historyService.getConversations());
  }, []);

  const currentConversation = useMemo(() => 
    conversations.find(c => c.id === currentConversationId),
    [conversations, currentConversationId]
  );

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
  
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all conversation history? This action cannot be undone.')) {
      historyService.clearConversations();
      setConversations([]);
      handleNewChat();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      if (touchStartRef.current === null) return;
      const currentY = e.targetTouches[0].clientY;
      // Check for a significant upward swipe
      if (touchStartRef.current - currentY > 40) {
          setIsSidebarOpen(true);
          touchStartRef.current = null; // Reset after triggering
      }
  };

  const handleTouchEnd = () => {
      touchStartRef.current = null;
  };

  return (
    <div className="relative min-h-screen font-sans">
      <div className="w-full h-screen p-4 sm:p-6 lg:flex lg:gap-6">
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
        
        <div className="flex-1 flex flex-col h-full w-full bg-slate-800/30 rounded-2xl shadow-2xl backdrop-blur-xl border border-slate-700/50 overflow-hidden">
          <header className="flex-shrink-0 w-full border-b border-slate-700/50">
              <div className="max-w-4xl mx-auto flex items-center gap-2 p-4 sm:p-6">
                <div className="flex-grow text-center">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    AI Response to PDF
                  </h1>
                </div>
              </div>
          </header>

          <main className="flex-grow w-full max-w-4xl mx-auto overflow-y-auto">
            <div className="p-4 sm:p-6">
              <ResponseDisplay 
                prompt={currentConversation?.prompt ?? (isLoading ? prompt : '')} 
                response={currentConversation?.response ?? ''} 
                isLoading={isLoading && !currentConversation} 
                error={error}
                onTypingComplete={() => setIsTyping(false)}
              />
            </div>
          </main>

          <footer className="w-full max-w-4xl mx-auto flex-shrink-0 p-4 sm:p-6 border-t border-slate-700/50">
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
            <div className="flex justify-between items-center text-xs text-slate-500 pt-3">
              <span>AI can make mistakes. Consider checking important information.</span>
              <div className="hidden lg:block">
                <RealTimeClock />
              </div>
            </div>
          </footer>
        </div>
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {!isSidebarOpen && (
        <div 
          className="lg:hidden fixed bottom-0 left-0 right-0 h-10 flex justify-center items-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-1.5 cursor-grab">
            <span className="text-xs text-slate-400 font-medium">History</span>
            <div className="w-10 h-1 bg-slate-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;