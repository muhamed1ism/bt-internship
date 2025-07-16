// Ticket status types and their display properties
export const TICKET_STATUSES = {
  PENDING: 'PENDING',
  ONGOING: 'ONGOING',
  AWAITING_CONFIRMATION: 'AWAITING_CONFIRMATION',
  FINISHED: 'FINISHED',
} as const;

// Status display configuration
export const TICKET_STATUS_CONFIG = {
  [TICKET_STATUSES.PENDING]: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏳',
    priority: 3,
  },
  [TICKET_STATUSES.ONGOING]: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '🔄',
    priority: 2,
  },
  [TICKET_STATUSES.AWAITING_CONFIRMATION]: {
    label: 'Awaiting Confirmation',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '⏱️',
    priority: 1, // Highest priority
  },
  [TICKET_STATUSES.FINISHED]: {
    label: 'Finished',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '✅',
    priority: 4,
  },
} as const;

// Polling intervals for real-time updates
export const POLLING_INTERVALS = {
  TICKET_LIST: 5000, // 5 seconds for ticket lists
  TICKET_DETAIL: 3000, // 3 seconds for individual tickets (faster)
  CHAT_MESSAGES: 4000, // 4 seconds for chat messages
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  STALE_TIME: {
    TICKET_LIST: 2000, // 2 seconds
    TICKET_DETAIL: 1000, // 1 second (very fresh)
    CHAT_MESSAGES: 2000, // 2 seconds
  },
  GC_TIME: {
    DEFAULT: 5 * 60 * 1000, // 5 minutes
    SHORT: 2 * 60 * 1000, // 2 minutes
  },
} as const;

// UI Configuration
export const UI_CONFIG = {
  DESCRIPTION_TRUNCATE_LENGTH: 120,
  CHAT_CONTAINER_HEIGHT: 'h-[600px]',
  TICKET_DETAILS_MAX_HEIGHT: 'max-h-16',
} as const;

// Default form values
export const DEFAULT_CREATE_TICKET_FORM = {
  title: '',
  description: '',
} as const;

// Message input placeholder text
export const MESSAGE_PLACEHOLDERS = {
  DEFAULT: 'Type your message...',
  FINISHED_TICKET: 'Ticket is finished - no more messages allowed',
  START_CONVERSATION: 'Start the conversation with your team member!',
  CTO_CONVERSATION: 'Start the conversation with your manager!',
} as const;
