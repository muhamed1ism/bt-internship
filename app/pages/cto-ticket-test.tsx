import { useState, useEffect, useRef, useCallback } from 'react';
import { ToastContainer, ToastNotification } from '../components/ui/toast-notification';
import {
  AnimatedBadge,
  PulsingIndicator,
  AnimatedTextBadge,
} from '../components/ui/animated-badge';

interface Ticket {
  id: string;
  employeeName: string;
  title: string;
  description: string;
  assignedAt: Date;
  assignedBy: string;
}

interface ChatMessage {
  id: string;
  ticketId: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: 'employee' | 'cto';
}

type TicketStatus = 'assigned' | 'in_progress' | 'finished' | 'reviewed';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: Date;
}

interface UnreadMessage {
  ticketId: string;
  messageId: string;
  timestamp: Date;
  sender: string;
  preview: string;
}

interface IncomingMessageNotification {
  id: string;
  ticketId: string;
  ticketTitle: string;
  sender: string;
  messagePreview: string;
  timestamp: Date;
}

declare global {
  interface Window {
    mockTickets: Ticket[];
    chatHistory: Record<string, ChatMessage[]>;
    chatMemory: Record<string, Array<{ sender: string; message: string; timestamp?: Date }>>;
    ticketStatuses: Record<string, TicketStatus>;
    statusNotifications: Record<string, Notification[]>;
    unreadMessages: Record<string, UnreadMessage[]>;
    lastReadMessages: Record<string, string>; // ticketId -> lastReadMessageId
    ctoLastReadMessages: Record<string, string>; // ticketId -> lastReadMessageId for CTO
    employeeLastReadMessages: Record<string, string>; // ticketId -> lastReadMessageId for Employee
    pendingNotifications: IncomingMessageNotification[]; // Global notification queue
  }
}

// Initialize global state
if (typeof window !== 'undefined') {
  if (!window.mockTickets) {
    window.mockTickets = [];
  }
  if (!window.chatHistory) {
    window.chatHistory = {};
  }
  if (!window.chatMemory) {
    window.chatMemory = {};
  }
  if (!window.ticketStatuses) {
    window.ticketStatuses = {};
  }
  if (!window.statusNotifications) {
    window.statusNotifications = {};
  }
  if (!window.unreadMessages) {
    window.unreadMessages = {};
  }
  if (!window.lastReadMessages) {
    window.lastReadMessages = {};
  }
  if (!window.ctoLastReadMessages) {
    window.ctoLastReadMessages = {};
  }
  if (!window.employeeLastReadMessages) {
    window.employeeLastReadMessages = {};
  }
  if (!window.pendingNotifications) {
    window.pendingNotifications = [];
  }
}

export const CtoTicketTest = () => {
  // Form states
  const [formData, setFormData] = useState({
    employeeName: '',
    title: '',
    description: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main states
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [ticketStatuses, setTicketStatuses] = useState<Record<string, TicketStatus>>({});
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({});

  // New states for improved UX
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showChatPanel, setShowChatPanel] = useState(false);

  const [incomingNotifications, setIncomingNotifications] = useState<IncomingMessageNotification[]>(
    [],
  );
  const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([]);

  // Performance optimization refs
  const ticketListRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load data and set up event listeners
  useEffect(() => {
    const initializeData = () => {
      // Load sample data if empty
      if (typeof window !== 'undefined' && window.mockTickets.length === 0) {
        const sampleTickets: Ticket[] = [
          {
            id: '1',
            employeeName: 'John Doe',
            title: 'Setup User Authentication',
            description: 'Implement Firebase authentication for the application',
            assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            assignedBy: 'CTO',
          },
          {
            id: '2',
            employeeName: 'John Doe',
            title: 'Database Schema Design',
            description: 'Design the database schema for user management',
            assignedAt: new Date(Date.now() - 30 * 60 * 1000),
            assignedBy: 'CTO',
          },
          {
            id: '3',
            employeeName: 'Jane Smith',
            title: 'API Integration',
            description: 'Integrate third-party payment API',
            assignedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            assignedBy: 'CTO',
          },
          {
            id: '4',
            employeeName: 'Mike Johnson',
            title: 'UI Component Library',
            description: 'Build reusable UI components',
            assignedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            assignedBy: 'CTO',
          },
        ];

        window.mockTickets = sampleTickets;

        // Initialize some sample statuses
        window.ticketStatuses = {
          '1': 'in_progress',
          '2': 'assigned',
          '3': 'finished',
          '4': 'assigned',
        };

        // Add some sample conversations
        window.chatHistory = {
          '1': [
            {
              id: 'msg1',
              ticketId: '1',
              sender: 'John Doe',
              message: 'I have started working on the authentication system',
              timestamp: new Date(Date.now() - 20 * 60 * 1000),
              type: 'employee',
            },
            {
              id: 'msg2',
              ticketId: '1',
              sender: 'CTO',
              message: 'Great! Let me know if you need any guidance',
              timestamp: new Date(Date.now() - 15 * 60 * 1000),
              type: 'cto',
            },
          ],
        };
      }

      loadTickets();
      loadConversations();
      loadTicketStatuses();
      loadUnreadMessages();
      loadLastReadMessages();
    };

    const loadTickets = () => {
      if (typeof window !== 'undefined') {
        const tickets = window.mockTickets?.filter((ticket) => ticket.assignedBy === 'CTO') || [];
        setActiveTickets(tickets);
      }
    };

    const loadConversations = () => {
      if (typeof window !== 'undefined') {
        setConversations(window.chatHistory || {});
      }
    };

    const loadTicketStatuses = () => {
      if (typeof window !== 'undefined') {
        setTicketStatuses(window.ticketStatuses || {});
      }
    };

    const loadUnreadMessages = () => {
      // No longer needed - using specific unread tracking functions
    };

    const loadLastReadMessages = () => {
      // Last read messages are tracked in global state only
      // No local state needed for performance optimization
    };

    // Event listeners for real-time updates
    const handleNewMessage = (event: CustomEvent) => {
      const { ticketId, message } = event.detail || {};

      if (ticketId && message) {
        // Always show notification for new messages
        const ticket = window.mockTickets?.find((t) => t.id === ticketId && t.assignedBy === 'CTO');

        if (ticket) {
          // Create toast notification with contextual messaging
          const toastNotification: ToastNotification = {
            id: Date.now().toString(),
            title:
              message.sender === 'CTO'
                ? 'New Instruction from CTO'
                : `Update from ${message.sender}`,
            sender: message.sender,
            ticketTitle: ticket.title,
            messagePreview:
              message.message.slice(0, 80) + (message.message.length > 80 ? '...' : ''),
            timestamp: new Date(),
          };

          setToastNotifications((prev) => [...prev, toastNotification]);

          // Auto-remove toast after 8 seconds
          setTimeout(() => {
            setToastNotifications((prev) => prev.filter((n) => n.id !== toastNotification.id));
          }, 8000);

          // Keep the old notification system for backward compatibility
          const notification: IncomingMessageNotification = {
            id: Date.now().toString(),
            ticketId,
            ticketTitle: ticket.title,
            sender: message.sender,
            messagePreview:
              message.message.slice(0, 50) + (message.message.length > 50 ? '...' : ''),
            timestamp: new Date(),
          };

          setIncomingNotifications((prev) => [...prev, notification]);

          // Auto-remove notification after 10 seconds
          setTimeout(() => {
            setIncomingNotifications((prev) => prev.filter((n) => n.id !== notification.id));
          }, 10000);
        }

        // Add to unread messages if not currently viewing this ticket
        if (ticketId !== selectedTicketId) {
          const unreadMessage: UnreadMessage = {
            ticketId,
            messageId: message.id,
            timestamp: new Date(message.timestamp),
            sender: message.sender,
            preview: message.message.slice(0, 50) + (message.message.length > 50 ? '...' : ''),
          };

          if (typeof window !== 'undefined') {
            if (!window.unreadMessages[ticketId]) {
              window.unreadMessages[ticketId] = [];
            }
            window.unreadMessages[ticketId].push(unreadMessage);
          }

          // Removed loadUnreadMessages() as we now use specific tracking functions
        }
      }

      loadConversations();

      // If this is the currently selected ticket, update the conversation view
      if (ticketId === selectedTicketId && typeof window !== 'undefined') {
        const ticketConversation = window.chatHistory[ticketId] || [];
        setConversations((prev) => ({
          ...prev,
          [ticketId]: ticketConversation,
        }));
      }
    };

    const handleStatusChange = () => {
      loadTicketStatuses();
    };

    const handleTicketUpdate = () => {
      loadTickets();
    };

    // Initialize data
    initializeData();

    // Set up event listeners
    window.addEventListener('newChatMessage', handleNewMessage as EventListener);
    window.addEventListener('ticketStatusChange', handleStatusChange);
    window.addEventListener('ticketUpdate', handleTicketUpdate);

    // Add listener for when employee marks ticket as read
    const handleTicketMarkedAsRead = (event: CustomEvent) => {
      const { ticketId } = event.detail || {};
      if (ticketId) {
        console.log(`📖 Employee marked ticket ${ticketId} as read - refreshing unread counts`);
        loadUnreadMessages();
      }
    };

    window.addEventListener('ticketMarkedAsRead', handleTicketMarkedAsRead as EventListener);

    // Add listener for storage changes to ensure real-time updates
    const handleStorageChange = () => {
      loadConversations();
      if (selectedTicketId && typeof window !== 'undefined') {
        const ticketConversation = window.chatHistory[selectedTicketId] || [];
        setConversations((prev) => ({
          ...prev,
          [selectedTicketId]: ticketConversation,
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('newChatMessage', handleNewMessage as EventListener);
      window.removeEventListener('ticketStatusChange', handleStatusChange);
      window.removeEventListener('ticketUpdate', handleTicketUpdate);
      window.removeEventListener('ticketMarkedAsRead', handleTicketMarkedAsRead as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [selectedTicketId]);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      // Create new ticket
      const newTicket: Ticket = {
        id: Date.now().toString(),
        employeeName: formData.employeeName,
        title: formData.title,
        description: formData.description,
        assignedAt: new Date(),
        assignedBy: 'CTO',
      };

      // Add to global state
      if (typeof window !== 'undefined') {
        window.mockTickets.push(newTicket);
        window.ticketStatuses[newTicket.id] = 'assigned';

        // Dispatch update event
        window.dispatchEvent(new CustomEvent('ticketUpdate'));
      }

      // Reset form
      setFormData({
        employeeName: '',
        title: '',
        description: '',
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chat handlers
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedTicketId) return;

    const messageObject: ChatMessage = {
      id: Date.now().toString(),
      ticketId: selectedTicketId,
      sender: 'CTO',
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'cto',
    };

    if (typeof window !== 'undefined') {
      // Add to chat history
      if (!window.chatHistory[selectedTicketId]) {
        window.chatHistory[selectedTicketId] = [];
      }
      window.chatHistory[selectedTicketId].push(messageObject);

      // Update last read message
      window.lastReadMessages[selectedTicketId] = messageObject.id;

      // Clear unread messages for this ticket
      if (window.unreadMessages[selectedTicketId]) {
        delete window.unreadMessages[selectedTicketId];
      }

      // Auto-unfinish ticket when CTO sends message
      if (window.ticketStatuses[selectedTicketId] === 'finished') {
        window.ticketStatuses[selectedTicketId] = 'in_progress';
        window.dispatchEvent(new CustomEvent('ticketStatusChange'));
      }

      // Trigger real-time update
      window.dispatchEvent(
        new CustomEvent('newChatMessage', {
          detail: { ticketId: selectedTicketId, message: messageObject },
        }),
      );
    }

    setNewMessage('');
    setConversations((prev) => ({
      ...prev,
      [selectedTicketId]: window.chatHistory[selectedTicketId] || [],
    }));
  }, [newMessage, selectedTicketId]);

  const handleTicketClick = useCallback(
    (ticketId: string) => {
      setSelectedTicketId(ticketId);
      setShowChatPanel(true);

      // Load conversation data for this ticket
      if (typeof window !== 'undefined') {
        const ticketConversation = window.chatHistory[ticketId] || [];
        setConversations((prev) => ({
          ...prev,
          [ticketId]: ticketConversation,
        }));

        // Mark all messages as read by CTO for this ticket
        const messages = ticketConversation;
        if (messages.length > 0) {
          window.lastReadMessages[ticketId] = messages[messages.length - 1].id;
          window.ctoLastReadMessages[ticketId] = messages[messages.length - 1].id;
        }

        // Clear unread messages for this ticket (remove notification overlay)
        if (window.unreadMessages[ticketId]) {
          delete window.unreadMessages[ticketId];
        }

        // Dispatch event to notify other parts of the app
        window.dispatchEvent(
          new CustomEvent('ctoReadMessages', {
            detail: { ticketId },
          }),
        );
      }

      // Local unread state clearing is no longer needed - using global state tracking
    },
    [activeTickets],
  );

  const handleNotificationClick = useCallback(
    (notification: IncomingMessageNotification) => {
      handleTicketClick(notification.ticketId);
      setIncomingNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    },
    [handleTicketClick],
  );

  const markTicketAsReviewed = useCallback((ticketId: string) => {
    if (typeof window !== 'undefined') {
      window.ticketStatuses[ticketId] = 'reviewed';
      window.dispatchEvent(new CustomEvent('ticketStatusChange'));
    }
    setTicketStatuses((prev) => ({
      ...prev,
      [ticketId]: 'reviewed',
    }));
  }, []);

  // Utility functions
  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'assigned':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'finished':
        return 'bg-green-100 text-green-800';
      case 'reviewed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TicketStatus) => {
    switch (status) {
      case 'assigned':
        return '📋 Assigned';
      case 'in_progress':
        return '⚡ In Progress';
      case 'finished':
        return '✅ Finished';
      case 'reviewed':
        return '🎉 Reviewed';
      default:
        return 'Unknown';
    }
  };

  const getLastMessageTime = (ticketId: string) => {
    const messages = conversations[ticketId] || [];
    if (messages.length === 0) return null;

    const lastMessage = messages[messages.length - 1];
    const now = new Date();
    const diff = now.getTime() - new Date(lastMessage.timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Smart logic: Get new employee messages that CTO hasn't seen yet
  const getNewEmployeeMessages = (ticketId: string) => {
    if (typeof window === 'undefined') return 0;

    const messages = window.chatHistory[ticketId] || [];
    const ctoLastReadId = window.ctoLastReadMessages?.[ticketId];

    if (!ctoLastReadId) {
      // If CTO hasn't read any messages, count all employee messages
      return messages.filter((msg) => msg.sender !== 'CTO').length;
    }

    const lastReadIndex = messages.findIndex((msg) => msg.id === ctoLastReadId);
    if (lastReadIndex === -1) {
      return messages.filter((msg) => msg.sender !== 'CTO').length;
    }

    // Count employee messages that came after CTO's last read message
    return messages.slice(lastReadIndex + 1).filter((msg) => msg.sender !== 'CTO').length;
  };

  // Smart logic: Check if CTO is awaiting response from employee
  const getCtoAwaitingResponse = (ticketId: string) => {
    if (typeof window === 'undefined') return { isAwaiting: false, count: 0 };

    const messages = window.chatHistory[ticketId] || [];
    if (messages.length === 0) return { isAwaiting: false, count: 0 };

    // Get the last message
    const lastMessage = messages[messages.length - 1];

    // If last message is from employee, CTO is not awaiting response
    if (lastMessage.sender !== 'CTO') {
      return { isAwaiting: false, count: 0 };
    }

    // Count consecutive CTO messages at the end (awaiting response)
    let count = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'CTO') {
        count++;
      } else {
        break;
      }
    }

    return { isAwaiting: true, count };
  };

  // Filtered and sorted tickets
  const filteredTickets = activeTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || (ticketStatuses[ticket.id] || 'assigned') === statusFilter;

    const matchesEmployee =
      !employeeFilter || ticket.employeeName.toLowerCase().includes(employeeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesEmployee;
  });

  const sortedTickets = filteredTickets.sort((a, b) => {
    // Priority 1: New employee messages first (most important for CTO)
    const aNewEmployee = getNewEmployeeMessages(a.id);
    const bNewEmployee = getNewEmployeeMessages(b.id);

    if (aNewEmployee !== bNewEmployee) {
      return bNewEmployee - aNewEmployee; // More new employee messages first
    }

    // Priority 2: Finished tickets needing review
    const aStatus = ticketStatuses[a.id] || 'assigned';
    const bStatus = ticketStatuses[b.id] || 'assigned';

    if (aStatus === 'finished' && bStatus !== 'finished') {
      return -1; // Finished tickets come first
    }
    if (bStatus === 'finished' && aStatus !== 'finished') {
      return 1; // Finished tickets come first
    }

    // Priority 3: Tickets where CTO is awaiting response
    const aAwaitingResponse = getCtoAwaitingResponse(a.id);
    const bAwaitingResponse = getCtoAwaitingResponse(b.id);

    if (aAwaitingResponse.isAwaiting !== bAwaitingResponse.isAwaiting) {
      return aAwaitingResponse.isAwaiting ? 1 : -1; // New messages have higher priority than awaiting
    }

    if (aAwaitingResponse.isAwaiting && bAwaitingResponse.isAwaiting) {
      return bAwaitingResponse.count - aAwaitingResponse.count; // More awaiting messages first
    }

    // Priority 4: If both have same status, sort by last message time
    const aLastMessage = conversations[a.id]?.slice(-1)[0];
    const bLastMessage = conversations[b.id]?.slice(-1)[0];

    if (!aLastMessage && !bLastMessage) {
      return new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime();
    }

    if (!aLastMessage) return 1;
    if (!bLastMessage) return -1;

    return new Date(bLastMessage.timestamp).getTime() - new Date(aLastMessage.timestamp).getTime();
  });

  // Form validation
  const isFormValid =
    formData.employeeName.trim() && formData.title.trim() && formData.description.trim();

  // Get selected ticket data
  const selectedTicket = selectedTicketId
    ? activeTickets.find((t) => t.id === selectedTicketId)
    : null;
  const selectedTicketStatus = selectedTicketId
    ? ticketStatuses[selectedTicketId] || 'assigned'
    : 'assigned';
  const selectedConversation = selectedTicketId ? conversations[selectedTicketId] || [] : [];

  // Get unique employees for filter
  const uniqueEmployees = [...new Set(activeTickets.map((t) => t.employeeName))];

  // Toast notification handlers
  const handleToastDismiss = useCallback((id: string) => {
    setToastNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleToastClick = useCallback(
    (notification: ToastNotification) => {
      // Find the ticket by title and navigate to it
      const ticket = activeTickets.find((t) => t.title === notification.ticketTitle);
      if (ticket) {
        handleTicketClick(ticket.id);
      }
    },
    [activeTickets, handleTicketClick],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      <ToastContainer
        notifications={toastNotifications}
        onDismiss={handleToastDismiss}
        onClick={handleToastClick}
      />

      {/* Incoming Message Notifications */}
      {incomingNotifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {incomingNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className="animate-in slide-in-from-right max-w-sm cursor-pointer rounded-lg border border-blue-200 bg-white p-4 shadow-lg duration-300"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-sm font-medium text-blue-600">💬</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {notification.ticketTitle}
                  </p>
                  <p className="text-xs text-gray-500">{notification.sender}</p>
                  <p className="mt-1 text-sm text-gray-700">{notification.messagePreview}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIncomingNotifications((prev) =>
                      prev.filter((n) => n.id !== notification.id),
                    );
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">CTO Ticket Management</h1>
          <p className="mt-2 text-gray-600">
            Manage {activeTickets.length} tickets across your development team
          </p>
        </div>

        {/* Quick Assignment Form */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Ticket Assignment</h2>
            <p className="text-sm text-gray-600">Create and assign new work to team members</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label
                htmlFor="employeeName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Employee Name
              </label>
              <input
                type="text"
                id="employeeName"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter employee name"
                required
              />
            </div>

            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                Ticket Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter ticket title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Brief description"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSubmitting ? 'Assigning...' : 'Assign Ticket'}
              </button>
            </div>
          </form>

          {showSuccess && (
            <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3">
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-green-800">
                  Ticket assigned successfully!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Ticket List */}
        <div className="rounded-lg bg-white shadow-sm">
          {/* Sticky Header with Filters */}
          <div className="sticky top-0 z-10 rounded-t-lg border-b border-gray-200 bg-white px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                All Tickets ({filteredTickets.length})
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {incomingNotifications.length > 0 && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                      {incomingNotifications.length} new message
                      {incomingNotifications.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
                  Search
                </label>
                <input
                  ref={searchInputRef}
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Search tickets, employees..."
                />
              </div>

              <div>
                <label
                  htmlFor="status-filter"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | TicketStatus)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="assigned">📋 Assigned</option>
                  <option value="in_progress">⚡ In Progress</option>
                  <option value="finished">✅ Finished</option>
                  <option value="reviewed">🎉 Reviewed</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="employee-filter"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Employee
                </label>
                <select
                  id="employee-filter"
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">All Employees</option>
                  {uniqueEmployees.map((employee) => (
                    <option key={employee} value={employee}>
                      {employee}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Scrollable Ticket List */}
          <div ref={ticketListRef} className="max-h-96 overflow-y-auto" style={{ height: '600px' }}>
            {sortedTickets.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-4xl">📋</div>
                  <p className="text-gray-500">No tickets match your filters</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sortedTickets.map((ticket) => {
                  const status = ticketStatuses[ticket.id] || 'assigned';
                  const newEmployeeCount = getNewEmployeeMessages(ticket.id);
                  const awaitingResponse = getCtoAwaitingResponse(ticket.id);
                  const hasNewEmployeeMessages = newEmployeeCount > 0;
                  const isAwaitingEmployeeResponse = awaitingResponse.isAwaiting;
                  const awaitingCount = awaitingResponse.count;
                  const lastMessageTime = getLastMessageTime(ticket.id);
                  const hasMessages = conversations[ticket.id]?.length > 0;
                  const needsReview = status === 'finished';

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket.id)}
                      className={`relative cursor-pointer px-6 py-4 transition-all duration-200 ${
                        hasNewEmployeeMessages
                          ? 'border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg ring-1 ring-red-200 hover:from-red-100 hover:to-pink-100'
                          : needsReview
                            ? 'border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg ring-1 ring-green-200 hover:from-green-100 hover:to-emerald-100'
                            : isAwaitingEmployeeResponse
                              ? 'border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg ring-1 ring-blue-200 hover:from-blue-100 hover:to-indigo-100'
                              : 'hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      {/* Animated notification badges */}
                      {(hasNewEmployeeMessages || isAwaitingEmployeeResponse || needsReview) && (
                        <div className="absolute -top-2 -right-2 z-10 flex space-x-1">
                          {hasNewEmployeeMessages && (
                            <AnimatedBadge
                              count={newEmployeeCount}
                              type="employee"
                              size="lg"
                              title={`${newEmployeeCount} new messages from ${ticket.employeeName}`}
                            />
                          )}
                          {needsReview && (
                            <AnimatedBadge
                              count={1}
                              type="notification"
                              size="lg"
                              title="Finished work needs review"
                            />
                          )}
                          {isAwaitingEmployeeResponse && (
                            <AnimatedBadge
                              count={awaitingCount}
                              type="cto"
                              size="lg"
                              title={`${awaitingCount} messages unanswered since your last reply`}
                            />
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-3">
                            {/* Enhanced notification indicator */}
                            {(hasNewEmployeeMessages ||
                              isAwaitingEmployeeResponse ||
                              needsReview) && (
                              <PulsingIndicator
                                type={
                                  hasNewEmployeeMessages
                                    ? 'employee'
                                    : needsReview
                                      ? 'notification'
                                      : 'cto'
                                }
                                size="md"
                              />
                            )}

                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3
                                  className={`truncate text-sm font-medium ${
                                    hasNewEmployeeMessages ||
                                    isAwaitingEmployeeResponse ||
                                    needsReview
                                      ? 'font-bold text-gray-900'
                                      : 'text-gray-900'
                                  }`}
                                >
                                  {hasNewEmployeeMessages && '🔔 '}
                                  {needsReview && '✅ '}
                                  {isAwaitingEmployeeResponse &&
                                    !hasNewEmployeeMessages &&
                                    !needsReview &&
                                    '🔔 '}
                                  {ticket.title}
                                </h3>
                                {hasNewEmployeeMessages && (
                                  <AnimatedTextBadge
                                    text={`${newEmployeeCount} FROM EMPLOYEE`}
                                    type="employee"
                                    icon="💬"
                                    isNew={true}
                                  />
                                )}
                                {needsReview && (
                                  <AnimatedTextBadge
                                    text="NEEDS REVIEW"
                                    type="notification"
                                    icon="✅"
                                    isNew={true}
                                  />
                                )}
                                {isAwaitingEmployeeResponse && (
                                  <AnimatedTextBadge
                                    text={
                                      awaitingCount > 1
                                        ? `${awaitingCount} unanswered since your last reply`
                                        : 'Awaiting response'
                                    }
                                    type="cto"
                                    icon="⏳"
                                    isNew={true}
                                  />
                                )}
                              </div>
                              <p
                                className={`truncate text-sm ${
                                  hasNewEmployeeMessages
                                    ? 'font-semibold text-red-700'
                                    : needsReview
                                      ? 'font-semibold text-green-700'
                                      : isAwaitingEmployeeResponse
                                        ? 'font-semibold text-blue-700'
                                        : 'text-gray-500'
                                }`}
                              >
                                💬 {ticket.employeeName}{' '}
                                {hasNewEmployeeMessages
                                  ? '• Has new messages!'
                                  : needsReview
                                    ? '• Work finished - needs review'
                                    : isAwaitingEmployeeResponse
                                      ? '• Awaiting response'
                                      : ''}
                              </p>
                              <p className="mt-1 truncate text-xs text-gray-400">
                                {ticket.description}
                              </p>
                            </div>

                            <div className="flex items-center space-x-4">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}
                              >
                                {getStatusText(status)}
                              </span>

                              <div className="text-right">
                                {hasMessages && (
                                  <p className="text-xs text-gray-500">
                                    Last message: {lastMessageTime}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400">
                                  Assigned: {new Date(ticket.assignedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 flex items-center">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Slide-out Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-96 transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          showChatPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedTicket && (
          <div className="flex h-full flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{selectedTicket.title}</h3>
                <p className="text-sm text-gray-600">Chat with {selectedTicket.employeeName}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedTicketStatus)}`}
                >
                  {getStatusText(selectedTicketStatus)}
                </span>
                <button
                  onClick={() => setShowChatPanel(false)}
                  className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
              <div className="flex items-center space-x-3">
                {selectedTicketStatus === 'finished' && (
                  <button
                    onClick={() => markTicketAsReviewed(selectedTicketId!)}
                    className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                  >
                    ✅ Mark as Reviewed
                  </button>
                )}
                <div className="text-xs text-gray-500">
                  Status: {getStatusText(selectedTicketStatus)}
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {selectedConversation.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 text-4xl">💬</div>
                    <p className="text-gray-500">No messages yet</p>
                    <p className="mt-1 text-sm text-gray-400">Start the conversation below</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedConversation.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'CTO' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                          message.sender === 'CTO'
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 bg-white text-gray-900'
                        }`}
                      >
                        <div className="mb-1 text-sm font-medium">{message.sender}</div>
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`mt-1 text-xs ${message.sender === 'CTO' ? 'text-blue-100' : 'text-gray-500'}`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {showChatPanel && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
          onClick={() => setShowChatPanel(false)}
        />
      )}
    </div>
  );
};
