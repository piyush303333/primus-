import { Conversation } from '../types';

const CONVERSATION_HISTORY_KEY = 'aiConversationHistory';

export const getConversations = (): Conversation[] => {
  try {
    const storedHistory = localStorage.getItem(CONVERSATION_HISTORY_KEY);
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
  } catch (error) {
    console.error("Failed to parse conversation history:", error);
    localStorage.removeItem(CONVERSATION_HISTORY_KEY);
  }
  return [];
};

export const saveConversations = (conversations: Conversation[]): void => {
  try {
    localStorage.setItem(CONVERSATION_HISTORY_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error("Failed to save conversation history:", error);
  }
};

export const clearConversations = (): void => {
  try {
    localStorage.removeItem(CONVERSATION_HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear conversation history:", error);
  }
};