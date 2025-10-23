import React from 'react';
import { Conversation } from '../types';
import { PiyushGokheLogo } from './PiyushGokheLogo';

interface ConversationHistoryProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onClearHistory: () => void;
  isSelectingId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const MiniSpinner: React.FC = () => (
  <svg className="animate-spin h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
  onClearHistory,
  isSelectingId,
  isOpen,
  onClose,
}) => {
  const isAnyLoading = isSelectingId !== null;
  const sheetRef = React.useRef<HTMLElement>(null);
  const touchStartRef = React.useRef<number | null>(null);
  const navRef = React.useRef<HTMLElement>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    // Prevent closing if the user is trying to scroll the list
    if (navRef.current && navRef.current.scrollTop > 0) {
      touchStartRef.current = null;
      return;
    }
    touchStartRef.current = e.targetTouches[0].clientY;
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (touchStartRef.current === null) return;
    const currentY = e.targetTouches[0].clientY;
    
    // Check for a significant downward swipe to close
    if (currentY - touchStartRef.current > 50) {
      onClose();
      touchStartRef.current = null; // Reset after action
    }
  };
  
  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  return (
    <aside
      ref={sheetRef}
      className={`
        flex flex-col
        transition-transform duration-300 ease-in-out
        
        // --- Mobile styles (default): Bottom Sheet. Fixed position ignores parent padding. ---
        fixed z-30 bg-slate-900/70 backdrop-blur-lg border-slate-700/50 
        inset-x-0 bottom-0 h-[80vh] max-h-[600px] rounded-t-2xl border-t
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        
        // --- Desktop styles: Sidebar. Becomes a relative flex item. ---
        lg:relative lg:z-auto lg:h-full lg:w-64 lg:flex-shrink-0 lg:translate-y-0 lg:inset-auto
        lg:bg-slate-800/30 lg:rounded-2xl lg:shadow-2xl lg:backdrop-blur-xl lg:border lg:border-slate-700/50
      `}
    >
      {/* Mobile-only drag handle to pull down */}
      <div
        className="lg:hidden w-full flex-shrink-0 cursor-grab py-4 text-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-600"></div>
      </div>

      <div className="flex justify-between items-center mb-4 px-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-200">History</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            disabled={isAnyLoading}
            className="flex items-center justify-center text-sm font-semibold bg-cyan-500 text-white rounded-lg py-2 px-3 hover:bg-cyan-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Chat
          </button>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white" aria-label="Close history">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <nav ref={navRef} className="flex-grow overflow-y-auto px-4">
        {conversations.length > 0 ? (
          <ul>
            {conversations.map((convo) => {
              const isSelectingThis = isSelectingId === convo.id;
              const isCurrent = currentConversationId === convo.id;
              
              return (
                <li key={convo.id}>
                  <button
                    onClick={() => onSelectConversation(convo.id)}
                    disabled={isAnyLoading}
                    className={`w-full text-left p-3 rounded-lg my-1 transition-all duration-300 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-purple-600/50 to-cyan-500/50 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    } ${isAnyLoading && !isSelectingThis ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex-1 truncate">
                      <p className={`text-sm truncate ${isCurrent ? 'font-semibold' : 'font-medium'}`}>
                        {convo.prompt}
                      </p>
                      <p className={`text-xs mt-1 ${isCurrent ? 'text-purple-200' : 'text-slate-400'}`}>
                        {formatTimestamp(convo.timestamp)}
                      </p>
                    </div>
                    {isSelectingThis && (
                      <div className="ml-2 flex-shrink-0">
                        <MiniSpinner />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 text-center px-2 py-4">
            No conversations yet.
          </p>
        )}
      </nav>

      <div className="flex-shrink-0 p-4 sm:p-6 border-t border-slate-700/50">
        {conversations.length > 0 && (
          <button
            onClick={onClearHistory}
            disabled={isAnyLoading}
            className="w-full flex items-center justify-center text-sm text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors duration-200 rounded-md py-2 px-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Clear all conversation history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All History
          </button>
        )}
         <div className="flex justify-start items-center gap-2 text-xs text-slate-500">
            <span>Created by</span>
            <a href="https://www.webo.online" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
              <PiyushGokheLogo />
              <span className="font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">Piyush Gokhe</span>
            </a>
        </div>
      </div>
    </aside>
  );
};