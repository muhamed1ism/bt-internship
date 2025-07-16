import { TICKET_STATUS_CONFIG } from '@app/constants/ticket';
import type { TicketStatus, Ticket } from '@app/types/ticket';

/**
 * Format date and time for display
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

/**
 * Format time only for display
 */
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get user initials from full name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

/**
 * Get status configuration for a ticket status
 */
export const getStatusConfig = (status: TicketStatus) => {
  return TICKET_STATUS_CONFIG[status];
};

/**
 * Get time ago string for a date
 */
export const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  }
};

/**
 * Sort tickets by priority (status) and date
 */
export const sortTicketsByPriority = (tickets: Ticket[]): Ticket[] => {
  return tickets.sort((a, b) => {
    const aConfig = getStatusConfig(a.status);
    const bConfig = getStatusConfig(b.status);

    // Sort by priority first (lower number = higher priority)
    if (aConfig.priority !== bConfig.priority) {
      return aConfig.priority - bConfig.priority;
    }

    // If same priority, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

/**
 * Filter tickets by search term
 */
export const filterTicketsBySearch = (tickets: Ticket[], searchTerm: string): Ticket[] => {
  if (!searchTerm.trim()) return tickets;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(lowerSearchTerm) ||
      ticket.description.toLowerCase().includes(lowerSearchTerm),
  );
};

/**
 * Check if user is owner of a message based on their name
 */
export const isMessageOwner = (messageSenderId: string, currentUserId: string): boolean => {
  return messageSenderId === currentUserId;
};
