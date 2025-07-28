// Chat Service - Backend Integration for Ticket Messages
// This file contains chat functionality connected to the backend API

import { createMessageApi, getTicketMessagesApi } from '@app/api/ticket-api';
import { TicketMessage } from '@app/types/ticket';

// Types for chat functionality
export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  createdAt: Date;
}

// Simplified message structure for window.chatMemory
export interface SimpleChatMessage {
  sender: string;
  message: string;
  createdAt?: Date;
}

export interface ChatChannel {
  id: string;
  ticketId: string;
  participants: string[];
  messages: ChatMessage[];
}

// Global window interface extension
declare global {
  interface Window {
    chatMemory: { [ticketId: string]: SimpleChatMessage[] };
  }
}

// Mock chat service class
export class ChatService {
  private static instance: ChatService;
  private isInitialized = false;
  private activeChannels: Map<string, ChatChannel> = new Map();

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /**
   * Initialize chat for a specific ticket
   * @param ticketId - The ID of the ticket to initialize chat for
   */
  public async initChat(ticketId: string): Promise<void> {
    console.log(`Initializing chat for ticket ${ticketId}`);

    // Initialize chatMemory structure for fallback
    this.initializeChatMemory(ticketId);

    try {
      // Load existing messages from backend
      const messages = await getTicketMessagesApi(ticketId);

      // Store messages in active channel
      const channel: ChatChannel = {
        id: ticketId,
        ticketId,
        participants: [],
        messages: messages.map(this.convertTicketMessageToChatMessage),
      };

      this.activeChannels.set(ticketId, channel);

      // Also store in window.chatMemory for compatibility
      if (typeof window !== 'undefined') {
        window.chatMemory[ticketId] = messages.map((msg) => ({
          sender: `${msg.senderUser.firstName} ${msg.senderUser.lastName}`,
          message: msg.content,
          createdAt: new Date(msg.createdAt),
        }));
      }

      this.isInitialized = true;
      console.log(`Chat initialized successfully for ticket ${ticketId}`);
    } catch (error) {
      console.error(`Failed to initialize chat for ticket ${ticketId}:`, error);
      throw error;
    }
  }

  /**
   * Send a message to a ticket's chat channel
   * @param ticketId - The ticket ID
   * @param message - The message to send
   * @param sender - The sender's name/ID
   */
  public async sendMessage(
    ticketId: string,
    message: string,
    sender: string,
  ): Promise<ChatMessage> {
    console.log(`Sending message to ticket ${ticketId} from ${sender}: ${message}`);

    // Initialize chatMemory if not exists
    this.initializeChatMemory(ticketId);

    try {
      // Send message to backend
      const ticketMessage = await createMessageApi(ticketId, { content: message });

      // Convert to ChatMessage format
      const newMessage = this.convertTicketMessageToChatMessage(ticketMessage);

      // Store in window.chatMemory for compatibility
      if (typeof window !== 'undefined') {
        window.chatMemory[ticketId].push({
          sender: newMessage.sender,
          message: newMessage.message,
          createdAt: newMessage.createdAt,
        });
      }

      // Store in active channel
      const channel = this.activeChannels.get(ticketId);
      if (channel) {
        channel.messages.push(newMessage);
      }

      return newMessage;
    } catch (error) {
      console.error(`Failed to send message to ticket ${ticketId}:`, error);
      throw error;
    }
  }

  /**
   * Convert TicketMessage to ChatMessage format
   * @param ticketMessage - The backend message format
   */
  private convertTicketMessageToChatMessage(ticketMessage: TicketMessage): ChatMessage {
    return {
      id: ticketMessage.id,
      sender: `${ticketMessage.senderUser.firstName} ${ticketMessage.senderUser.lastName}`,
      message: ticketMessage.content,
      createdAt: new Date(ticketMessage.createdAt),
    };
  }

  /**
   * Get chat history for a ticket
   * @param ticketId - The ticket ID
   */
  public async getChatHistory(ticketId: string): Promise<ChatMessage[]> {
    console.log(`Fetching chat history for ticket ${ticketId}`);

    // Initialize chatMemory if not exists
    this.initializeChatMemory(ticketId);

    try {
      // Fetch messages from backend
      const messages = await getTicketMessagesApi(ticketId);

      // Convert to ChatMessage format
      const chatMessages = messages.map(this.convertTicketMessageToChatMessage);

      // Update window.chatMemory for compatibility
      if (typeof window !== 'undefined') {
        window.chatMemory[ticketId] = messages.map((msg) => ({
          sender: `${msg.senderUser.firstName} ${msg.senderUser.lastName}`,
          message: msg.content,
          createdAt: new Date(msg.createdAt),
        }));
      }

      // Update active channel
      const channel = this.activeChannels.get(ticketId);
      if (channel) {
        channel.messages = chatMessages;
      }

      return chatMessages;
    } catch (error) {
      console.error(`Failed to fetch chat history for ticket ${ticketId}:`, error);

      // Fallback to local storage if backend fails
      if (typeof window !== 'undefined' && window.chatMemory && window.chatMemory[ticketId]) {
        return window.chatMemory[ticketId].map((msg, index) => ({
          id: `${ticketId}-${index}`,
          sender: msg.sender,
          message: msg.message,
          createdAt: msg.createdAt || new Date(),
        }));
      }

      // Final fallback to active channel
      const channel = this.activeChannels.get(ticketId);
      return channel?.messages || [];
    }
  }

  /**
   * Subscribe to real-time messages for a ticket
   * @param ticketId - The ticket ID
   * @param callback - Callback function for new messages
   */
  public subscribeToMessages(
    ticketId: string,
    callback: (message: ChatMessage) => void,
  ): () => void {
    console.log(`Subscribing to messages for ticket ${ticketId}`);

    // Here goes GetStream/Twilio real-time subscription
    //
    // For GetStream:
    // const channel = client.channel('messaging', ticketId);
    // channel.on('message.new', (event) => {
    //   callback(event.message);
    // });
    //
    // For Twilio Conversations:
    // const conversation = await client.getConversationByUniqueName(ticketId);
    // conversation.on('messageAdded', (message) => {
    //   callback(message);
    // });

    // Mock subscription - store callback for future use
    // In real implementation, this would be the actual listener registration
    console.log(`Mock: Callback registered for ticket ${ticketId}`, callback);

    // Return unsubscribe function
    return () => {
      console.log(`Unsubscribing from messages for ticket ${ticketId}`);
      // Here goes cleanup logic
    };
  }

  /**
   * Disconnect from chat service
   */
  public async disconnect(): Promise<void> {
    console.log('Disconnecting from chat service');

    // Here goes GetStream/Twilio disconnect logic
    //
    // For GetStream:
    // await client.disconnectUser();
    //
    // For Twilio Conversations:
    // await client.shutdown();

    this.isInitialized = false;
    this.activeChannels.clear();
  }

  /**
   * Initialize chatMemory structure for a ticket
   */
  private initializeChatMemory(ticketId: string): void {
    if (typeof window !== 'undefined') {
      // Initialize chatMemory object if it doesn't exist
      if (!window.chatMemory) {
        window.chatMemory = {};
      }

      // Initialize array for this ticket if it doesn't exist
      if (!window.chatMemory[ticketId]) {
        window.chatMemory[ticketId] = [];
      }
    }
  }

  /**
   * Get initialization status
   */
  public isReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const chatService = ChatService.getInstance();

// Helper functions for easier usage
export const initChat = (ticketId: string) => chatService.initChat(ticketId);
export const sendMessage = (ticketId: string, message: string, sender: string) =>
  chatService.sendMessage(ticketId, message, sender);
export const getChatHistory = (ticketId: string) => chatService.getChatHistory(ticketId);
export const subscribeToMessages = (ticketId: string, callback: (message: ChatMessage) => void) =>
  chatService.subscribeToMessages(ticketId, callback);
