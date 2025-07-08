import { useState, useEffect, useCallback } from 'react';
import { getTicketMessages, createMessage, type TicketMessage } from '../api/ticket-api';

/**
 * React hook for chat functionality
 * @param ticketId - The ticket ID to initialize chat for
 */
export const useChat = (ticketId: string | null) => {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
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
      const history = await getTicketMessages(ticketId);
      setMessages(history);
      setIsInitialized(true);
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
    async (message: string) => {
      if (!ticketId || !message.trim()) return;

      try {
        const newMessage = await createMessage(ticketId, { content: message });
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
   * Reset chat state when ticket changes
   */
  useEffect(() => {
    if (ticketId !== null) {
      setMessages([]);
      setIsInitialized(false);
      setError(null);
      initializeChat();
    }
  }, [ticketId, initializeChat]);

  /**
   * Clear state when no ticket is selected
   */
  useEffect(() => {
    if (ticketId === null) {
      setMessages([]);
      setIsInitialized(false);
      setError(null);
      setIsLoading(false);
    }
  }, [ticketId]);

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
