import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isTyping: boolean;

  setConversations: (conversations: Conversation[]) => void;
  createConversation: (title?: string) => string;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  getCurrentConversation: () => Conversation | undefined;
  
  addMessage: (conversationId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setTyping: (isTyping: boolean) => void;
  
  updateConversationTitle: (id: string, title: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  isTyping: false,

  setConversations: (conversations) => set({ conversations }),

  createConversation: (title = 'New Conversation') => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      currentConversationId: newConversation.id,
    }));
    
    return newConversation.id;
  },

  deleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((conv) => conv.id !== id),
      currentConversationId:
        state.currentConversationId === id ? null : state.currentConversationId,
    })),

  setCurrentConversation: (id) => set({ currentConversationId: id }),

  getCurrentConversation: () => {
    const { conversations, currentConversationId } = get();
    return conversations.find((conv) => conv.id === currentConversationId);
  },

  addMessage: (conversationId, message) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      ...message,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              updatedAt: new Date().toISOString(),
            }
          : conv
      ),
    }));
  },

  setTyping: (isTyping) => set({ isTyping }),

  updateConversationTitle: (id, title) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, title } : conv
      ),
    })),
}));

