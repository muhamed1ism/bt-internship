import { User } from './types';

// Core ticket types (matching API)
export type TicketStatus = 'PENDING' | 'ONGOING' | 'AWAITING_CONFIRMATION' | 'FINISHED';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  employeeId: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  ticketId: string;
  senderId: string;
  senderUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Status display configuration interface
export interface StatusConfig {
  label: string;
  color: string;
  icon: string;
  priority: number;
}

// Ticket counts for dashboard
export interface TicketCounts {
  total: number;
  pending: number;
  ongoing: number;
  awaitingConfirmation: number;
  finished: number;
}

// Sorting configuration for tickets
export type TicketSortKey = 'date' | 'title' | 'status' | 'priority';

export interface TicketSortConfig {
  key: TicketSortKey;
  direction: 'asc' | 'desc';
}

// Chat/Message related types
export interface Message {
  id: string;
  content: string;
  senderUser: User;
  createdAt: string;
  ticketId: string;
}

// Real-time hook options
export interface RealtimeOptions {
  pollingInterval?: number;
  enabled?: boolean;
}

// Component prop interfaces
export interface TicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: (ticket: Ticket) => void;
  onToggleDescription: (ticketId: string) => void;
  isDescriptionExpanded: boolean;
}

export interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export interface TicketActionsProps {
  ticket: Ticket;
  userRole: 'employee' | 'cto';
  onMarkAsFinished?: () => void;
  onConfirmFinished?: () => void;
  onMarkFinishedByCTO?: () => void;
  isLoading?: boolean;
}

export interface ChatMessageProps {
  message: TicketMessage;
  isCurrentUser: boolean;
}

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

// Ticket filtering and search
export interface TicketFilters {
  searchTerm: string;
  status?: TicketStatus[];
  sortBy: TicketSortKey;
}

// Ticket list component props
export interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId?: string;
  onSelectTicket: (ticket: Ticket) => void;
  isLoading?: boolean;
  filters?: TicketFilters;
  onFiltersChange?: (filters: TicketFilters) => void;
}
