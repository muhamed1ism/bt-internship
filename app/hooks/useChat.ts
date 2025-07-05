import { useState, useEffect, useCallback } from 'react';
import { chatService, type ChatMessage } from '../services/chat.service';

/**
 * React hook for chat functionality
 * @param ticketId - The ticket ID to initialize chat for
 */
export const useChat = (ticketId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize chat for the current ticket
   */
  const initializeChat = useCallback(async () => {
    if (!ticketId) return;

    setIsLoading(true);
    setError(null);

    try {
      await chatService.initChat(ticketId);
      setIsInitialized(true);

      // Load existing chat history
      const history = await chatService.getChatHistory(ticketId);
      setMessages(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize chat');
      console.error('Chat initialization failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  /**
   * Send a message
   */
  const sendMessage = useCallback(
    async (message: string, sender: string) => {
      if (!ticketId || !message.trim()) return;

      try {
        const newMessage = await chatService.sendMessage(ticketId, message, sender);
        setMessages((prev) => [...prev, newMessage]);
        return newMessage;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
        console.error('Message sending failed:', err);
        throw err;
      }
    },
    [ticketId],
  );

  /**
   * Subscribe to real-time messages
   */
  useEffect(() => {
    if (!ticketId || !isInitialized) return;

    const unsubscribe = chatService.subscribeToMessages(ticketId, (message) => {
      setMessages((prev) => {
        // Prevent duplicate messages
        const exists = prev.some((msg) => msg.id === message.id);
        if (exists) return prev;

        return [...prev, message];
      });
    });

    return unsubscribe;
  }, [ticketId, isInitialized]);

  /**
   * Auto-initialize when ticketId changes
   */
  useEffect(() => {
    if (ticketId && !isInitialized) {
      initializeChat();
    }
  }, [ticketId, isInitialized, initializeChat]);

  return {
    // State
    messages,
    isInitialized,
    isLoading,
    error,

    // Actions
    initializeChat,
    sendMessage,

    // Computed
    messageCount: messages.length,
    isReady: isInitialized && !isLoading,
  };
};

export default useChat;
