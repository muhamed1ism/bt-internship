import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { POLLING_INTERVALS, CACHE_CONFIG } from '@app/constants/ticket';
import { createMessageApi, getTicketMessagesApi } from '@app/api/ticket-api';
import { CreateMessageValue } from '@app/schemas/ticketSchema';
import { TicketMessage } from '@app/types/ticket';

/**
 * React Query keys for chat functionality
 */
export const CHAT_QUERY_KEYS = {
  messages: (ticketId: string) => ['tickets', ticketId, 'messages'] as const,
};

/**
 * Enhanced React hook for real-time chat functionality using React Query
 * @param ticketId - The ticket ID to initialize chat for
 * @param options - Configuration options
 */
export const useRealtimeChat = (
  ticketId: string | null,
  options: {
    pollingInterval?: number; // in milliseconds
    enabled?: boolean;
  } = {},
) => {
  const { pollingInterval = POLLING_INTERVALS.CHAT_MESSAGES, enabled = true } = options;
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef<number>(0);

  /**
   * Query for fetching messages with polling
   */
  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: CHAT_QUERY_KEYS.messages(ticketId || ''),
    queryFn: () => getTicketMessagesApi(ticketId!),
    enabled: enabled && !!ticketId,
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: true,
    staleTime: CACHE_CONFIG.STALE_TIME.CHAT_MESSAGES,
    gcTime: CACHE_CONFIG.GC_TIME.DEFAULT,
  });

  /**
   * Mutation for sending messages
   */
  const sendMessageMutation = useMutation({
    mutationFn: ({
      ticketId,
      messageData,
    }: {
      ticketId: string;
      messageData: CreateMessageValue;
    }) => createMessageApi(ticketId, messageData),
    onSuccess: (newMessage, variables) => {
      // Optimistically update the query cache
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.messages(variables.ticketId),
        (oldMessages: TicketMessage[] = []) => [...oldMessages, newMessage],
      );

      // Invalidate and refetch to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.messages(variables.ticketId),
      });
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
    },
  });

  /**
   * Send a message
   */
  const sendMessage = async (message: string) => {
    if (!ticketId || !message.trim()) return;

    const result = await sendMessageMutation.mutateAsync({
      ticketId,
      messageData: { content: message },
    });
    return result;
  };

  /**
   * Check if user is at the bottom of the chat
   */
  const isAtBottom = () => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
  };

  /**
   * Scroll to bottom of chat
   */
  const scrollToBottom = (behavior: 'smooth' | 'instant' = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  /**
   * Handle auto-scrolling when new messages arrive
   */
  useEffect(() => {
    if (messages.length > 0 && messages.length > previousMessageCountRef.current) {
      // New messages arrived
      const shouldAutoScroll = isAtBottom();

      if (shouldAutoScroll) {
        // Small delay to ensure DOM is updated
        setTimeout(() => scrollToBottom(), 100);
      }
    }

    previousMessageCountRef.current = messages.length;
  }, [messages]);

  /**
   * Scroll to bottom when ticket changes
   */
  useEffect(() => {
    if (ticketId && messages.length > 0) {
      // Initial scroll to bottom when switching tickets
      setTimeout(() => scrollToBottom('instant'), 100);
    }
  }, [ticketId, messages.length]);

  /**
   * Reset message count when ticket changes
   */
  useEffect(() => {
    if (ticketId) {
      previousMessageCountRef.current = 0;
    }
  }, [ticketId]);

  /**
   * Manually refresh messages
   */
  const refreshMessages = () => {
    if (ticketId) {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.messages(ticketId),
      });
    }
  };

  /**
   * Clear cache for a specific ticket
   */
  const clearCache = (targetTicketId?: string) => {
    const idToUse = targetTicketId || ticketId;
    if (idToUse) {
      queryClient.removeQueries({
        queryKey: CHAT_QUERY_KEYS.messages(idToUse),
      });
    }
  };

  return {
    // Data
    messages,
    isLoading,
    error,

    // Actions
    sendMessage,
    refreshMessages,
    clearCache,
    scrollToBottom,

    // Refs for scroll management
    messagesEndRef,
    containerRef,

    // State
    isSending: sendMessageMutation.isPending,
    sendError: sendMessageMutation.error,

    // Computed
    messageCount: messages.length,
    isReady: !isLoading && !!ticketId,
    hasMessages: messages.length > 0,

    // Utilities
    isAtBottom,
  };
};

export default useRealtimeChat;
