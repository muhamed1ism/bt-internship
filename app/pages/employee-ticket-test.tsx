import { useState, useEffect } from 'react';

// Define the ticket type (matching the CTO test page)
interface Ticket {
  id: string;
  employeeName: string;
  title: string;
  description: string;
  assignedAt: Date;
  assignedBy: string;
}

// Define chat message type
interface ChatMessage {
  id: string;
  ticketId: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: 'employee' | 'cto';
}

// Define ticket status type
type TicketStatus = 'assigned' | 'in_progress' | 'finished' | 'reviewed';

// Define notification type
interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: Date;
}

// Extend global Window interface
declare global {
  interface Window {
    mockTickets: Ticket[];
    readyToDiscuss: boolean;
    chatHistory: Record<string, ChatMessage[]>;
    chatMemory: Record<string, Array<{ sender: string; message: string; timestamp?: Date }>>;
    ticketStatuses: Record<string, TicketStatus>;
    statusNotifications: Record<string, Notification[]>;
    unreadMessages: Record<
      string,
      Array<{
        ticketId: string;
        messageId: string;
        timestamp: Date;
        sender: string;
        preview: string;
      }>
    >;
    lastReadMessages: Record<string, string>; // ticketId -> lastReadMessageId
  }
}

export const EmployeeTicketTest = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [availableTickets, setAvailableTickets] = useState<Ticket[]>([]);
  const [isReadyToDiscuss, setIsReadyToDiscuss] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [ticketStatuses, setTicketStatuses] = useState<Record<string, TicketStatus>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'title'>('date');

  useEffect(() => {
    // Initialize global storage
    if (typeof window !== 'undefined') {
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
    }

    // Add sample tickets for testing if none exist
    if (typeof window !== 'undefined') {
      if (!window.mockTickets || window.mockTickets.length === 0) {
        window.mockTickets = [
          {
            id: 'sample-ticket-1',
            employeeName: 'John Doe',
            title: 'Setup User Authentication',
            description:
              'Implement Firebase authentication flow for the application.\n\nTasks:\n- Configure Firebase project\n- Add login/logout functionality\n- Implement protected routes\n- Add user session management',
            assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            assignedBy: 'CTO',
          },
          {
            id: 'sample-ticket-2',
            employeeName: 'John Doe',
            title: 'Database Schema Design',
            description:
              'Design and implement the database schema for user management and role-based access control.',
            assignedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            assignedBy: 'CTO',
          },
        ];

        // Initialize status for sample tickets
        window.ticketStatuses['sample-ticket-1'] = 'assigned';
        window.ticketStatuses['sample-ticket-2'] = 'in_progress';

        console.log('✅ Added sample tickets for testing');
      }

      // Add initial chat conversation for testing
      if (!window.chatMemory) {
        window.chatMemory = {};
      }
      if (!window.chatHistory) {
        window.chatHistory = {};
      }

      // Add sample conversation for the latest ticket
      const sampleTicketId = 'sample-ticket-2';
      if (!window.chatMemory[sampleTicketId]) {
        window.chatMemory[sampleTicketId] = [
          {
            sender: 'CTO',
            message:
              'Hi John! I just assigned you the database schema task. Do you have any initial questions?',
          },
          {
            sender: 'John Doe',
            message:
              'Thanks for the assignment! I have a few questions about the user roles structure.',
          },
          {
            sender: 'CTO',
            message: 'Great! What specifically would you like to know about the roles?',
          },
          {
            sender: 'John Doe',
            message:
              'Should we implement hierarchical roles or keep it simple with just Admin, Team Lead, and User?',
          },
        ];

        // Also add to chatHistory with full message structure
        window.chatHistory[sampleTicketId] = window.chatMemory[sampleTicketId].map(
          (msg, index) => ({
            id: `sample-${index}`,
            ticketId: sampleTicketId,
            sender: msg.sender,
            message: msg.message,
            timestamp: new Date(Date.now() - (4 - index) * 5 * 60 * 1000), // Messages 20, 15, 10, 5 minutes ago
            type: msg.sender === 'CTO' ? 'cto' : 'employee',
          }),
        );

        console.log('✅ Added sample conversation between CTO and John Doe');
      }
    }

    // Load all available tickets on component mount and auto-select
    loadAvailableTicketsWithAutoSelect();

    // Check if already marked as ready to discuss
    if (typeof window !== 'undefined' && window.readyToDiscuss) {
      setIsReadyToDiscuss(true);
    }

    // Initialize chat history if it doesn't exist
    if (typeof window !== 'undefined' && !window.chatHistory) {
      window.chatHistory = {};
    }

    // Initialize chat memory if it doesn't exist
    if (typeof window !== 'undefined' && !window.chatMemory) {
      window.chatMemory = {};
    }

    // Load ticket statuses
    loadTicketStatuses();

    // Set up interval to check for new tickets (without auto-selection)
    const interval = setInterval(() => {
      loadAvailableTickets();
      loadTicketStatuses();
    }, 2000);

    // Listen for status changes from CTO
    const handleStatusChange = () => {
      loadTicketStatuses();
    };

    window.addEventListener('ticketStatusChange', handleStatusChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('ticketStatusChange', handleStatusChange);
    };
  }, []);

  // Load chat history when selected ticket changes
  useEffect(() => {
    if (selectedTicket) {
      loadChatHistory(selectedTicket.id);
    }
  }, [selectedTicket]);

  // Listen for new messages from CTO for the selected ticket
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const { ticketId, message } = event.detail || {};
      if (ticketId && message) {
        // If this is a CTO message and we're not currently viewing this ticket, don't mark as read
        if (message.sender === 'CTO' && (!selectedTicket || ticketId !== selectedTicket.id)) {
          // The message will remain unread until the user clicks on the ticket
          console.log(`📩 New CTO message for ticket ${ticketId} - keeping as unread`);
        }

        // Always reload chat history for the selected ticket
        if (selectedTicket && ticketId === selectedTicket.id) {
          loadChatHistory(ticketId);
        }

        // Force a re-render to update notification badges
        setAvailableTickets((prev) => [...prev]);
      }
    };

    window.addEventListener('newChatMessage', handleNewMessage as EventListener);

    return () => {
      window.removeEventListener('newChatMessage', handleNewMessage as EventListener);
    };
  }, [selectedTicket, setAvailableTickets]);

  // Load tickets without auto-selection (for periodic refresh)
  const loadAvailableTickets = () => {
    if (typeof window !== 'undefined' && window.mockTickets && window.mockTickets.length > 0) {
      const tickets = window.mockTickets;
      setAvailableTickets(tickets);

      // Only auto-select if the currently selected ticket no longer exists
      if (selectedTicket && !tickets.some((t) => t.id === selectedTicket.id)) {
        const latest = tickets[tickets.length - 1];
        setSelectedTicket(latest);
      }
    }
  };

  // Load tickets with auto-selection (only for initial load)
  const loadAvailableTicketsWithAutoSelect = () => {
    if (typeof window !== 'undefined' && window.mockTickets && window.mockTickets.length > 0) {
      const tickets = window.mockTickets;
      setAvailableTickets(tickets);

      // Auto-select latest ticket only on initial load
      if (!selectedTicket) {
        const latest = tickets[tickets.length - 1];
        setSelectedTicket(latest);
      }
    }
  };

  const loadTicketStatuses = () => {
    if (typeof window !== 'undefined' && window.ticketStatuses) {
      setTicketStatuses(window.ticketStatuses);
    }
  };

  const loadChatHistory = (ticketId: string) => {
    if (typeof window !== 'undefined' && window.chatHistory && window.chatHistory[ticketId]) {
      setChatMessages(window.chatHistory[ticketId]);
    } else {
      setChatMessages([]);
    }
  };

  // Function to get unread CTO messages count for a ticket
  const getUnreadCtoMessagesCount = (ticketId: string) => {
    if (typeof window === 'undefined') return 0;

    const messages = window.chatHistory[ticketId] || [];
    const ctoMessages = messages.filter((msg) => msg.sender === 'CTO');

    // Get the last read message ID for this ticket
    const lastReadMessageId = window.lastReadMessages?.[ticketId];

    if (!lastReadMessageId) {
      // If no messages have been read, all CTO messages are unread
      return ctoMessages.length;
    }

    // Find the index of the last read message
    const lastReadIndex = messages.findIndex((msg) => msg.id === lastReadMessageId);

    if (lastReadIndex === -1) {
      // If last read message not found, consider all CTO messages as unread
      return ctoMessages.length;
    }

    // Count CTO messages that came after the last read message
    const unreadCtoMessages = messages
      .slice(lastReadIndex + 1)
      .filter((msg) => msg.sender === 'CTO');

    return unreadCtoMessages.length;
  };

  const sendMessage = () => {
    if (!currentMessage.trim() || !selectedTicket) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      ticketId: selectedTicket.id,
      sender: selectedTicket.employeeName, // Use the actual employee name
      message: currentMessage.trim(),
      timestamp: new Date(),
      type: 'employee',
    };

    // Update local state
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);

    // Update global state
    if (typeof window !== 'undefined') {
      // Update full chat history
      if (!window.chatHistory[selectedTicket.id]) {
        window.chatHistory[selectedTicket.id] = [];
      }
      window.chatHistory[selectedTicket.id].push(newMessage);

      // Update simple chat memory
      if (!window.chatMemory[selectedTicket.id]) {
        window.chatMemory[selectedTicket.id] = [];
      }
      window.chatMemory[selectedTicket.id].push({
        sender: selectedTicket.employeeName, // Use the actual employee name
        message: currentMessage.trim(),
        timestamp: new Date(),
      });

      // Trigger real-time update
      window.dispatchEvent(
        new CustomEvent('newChatMessage', {
          detail: { ticketId: selectedTicket.id, message: newMessage },
        }),
      );
    }

    setCurrentMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleReadyToDiscuss = () => {
    setIsReadyToDiscuss(true);
    if (typeof window !== 'undefined') {
      window.readyToDiscuss = true;
    }
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  const handleMarkAsFinished = () => {
    if (!selectedTicket) return;

    // Update ticket status
    if (typeof window !== 'undefined') {
      window.ticketStatuses[selectedTicket.id] = 'finished';

      // Add notification for CTO
      if (!window.statusNotifications[selectedTicket.id]) {
        window.statusNotifications[selectedTicket.id] = [];
      }

      const notification: Notification = {
        id: Date.now().toString(),
        message: `${selectedTicket.employeeName} has marked "${selectedTicket.title}" as finished`,
        type: 'success',
        timestamp: new Date(),
      };

      window.statusNotifications[selectedTicket.id].push(notification);

      // Trigger status change event
      window.dispatchEvent(new CustomEvent('ticketStatusChange'));
    }

    // Update local state
    setTicketStatuses((prev) => ({
      ...prev,
      [selectedTicket.id]: 'finished',
    }));

    // Add local notification
    const localNotification: Notification = {
      id: Date.now().toString(),
      message: `You've marked "${selectedTicket.title}" as finished. Your CTO will be notified.`,
      type: 'success',
      timestamp: new Date(),
    };

    setNotifications((prev) => [...prev, localNotification]);

    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== localNotification.id));
    }, 5000);
  };

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
        return 'Assigned';
      case 'in_progress':
        return 'In Progress';
      case 'finished':
        return 'Finished';
      case 'reviewed':
        return 'Reviewed';
      default:
        return 'Unknown';
    }
  };

  // Filter and sort tickets
  const filteredAndSortedTickets = availableTickets
    .filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.employeeName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      // Priority 1: Tickets with unread CTO messages first
      const aUnreadCount = getUnreadCtoMessagesCount(a.id);
      const bUnreadCount = getUnreadCtoMessagesCount(b.id);

      if (aUnreadCount !== bUnreadCount) {
        return bUnreadCount - aUnreadCount; // More unread first
      }

      // Priority 2: Apply regular sorting for tickets with same unread status
      switch (sortBy) {
        case 'date':
          return new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime();
        case 'status': {
          const statusA = ticketStatuses[a.id] || 'assigned';
          const statusB = ticketStatuses[b.id] || 'assigned';
          return statusA.localeCompare(statusB);
        }
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'assigned':
        return '📋';
      case 'in_progress':
        return '⚡';
      case 'finished':
        return '✅';
      case 'reviewed':
        return '🎉';
      default:
        return '📋';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Function to mark ticket as read and clear notifications
  const markTicketAsRead = (ticketId: string) => {
    if (typeof window !== 'undefined') {
      // Clear any unread indicators for this ticket in global state
      if (window.unreadMessages && window.unreadMessages[ticketId]) {
        delete window.unreadMessages[ticketId];
      }

      // Mark last read message - this is crucial for proper read state tracking
      const messages = window.chatHistory[ticketId] || [];
      if (messages.length > 0) {
        window.lastReadMessages = window.lastReadMessages || {};
        window.lastReadMessages[ticketId] = messages[messages.length - 1].id;
      }

      // Trigger a custom event to notify other parts of the app about the read state change
      window.dispatchEvent(
        new CustomEvent('ticketMarkedAsRead', {
          detail: { ticketId },
        }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 mb-4 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg p-4 shadow-lg ${
                  notification.type === 'success'
                    ? 'border border-green-400 bg-green-100 text-green-700'
                    : notification.type === 'info'
                      ? 'border border-blue-400 bg-blue-100 text-blue-700'
                      : 'border border-yellow-400 bg-yellow-100 text-yellow-700'
                } max-w-sm`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {notification.type === 'success' && (
                      <svg
                        className="h-5 w-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Ticket List */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-xl font-bold text-gray-900">My Tickets</h2>
              <p className="text-gray-600">Select a ticket to view details</p>
            </div>

            {/* Search and Controls */}
            <div className="mb-4 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search tickets... (Press / to focus)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                      /
                    </kbd>
                  </div>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'title')}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {filteredAndSortedTickets.length} of {availableTickets.length} tickets
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded-md p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded-md p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`max-h-96 overflow-y-auto ${viewMode === 'grid' ? 'grid grid-cols-1 gap-3' : 'space-y-2'}`}
            >
              {filteredAndSortedTickets.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  {searchTerm ? 'No tickets match your search' : 'No tickets assigned yet'}
                </p>
              ) : (
                filteredAndSortedTickets.map((ticket) => {
                  const status = ticketStatuses[ticket.id] || 'assigned';
                  const unreadCtoMessages = getUnreadCtoMessagesCount(ticket.id);
                  const hasUnreadMessages = unreadCtoMessages > 0;

                  return (
                    <button
                      key={ticket.id}
                      onClick={() => {
                        setSelectedTicket(ticket);
                        markTicketAsRead(ticket.id);
                      }}
                      className={`relative w-full rounded-lg border p-4 text-left transition-all duration-200 ${
                        selectedTicket?.id === ticket.id
                          ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                          : hasUnreadMessages
                            ? 'border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg ring-1 ring-orange-200 hover:from-orange-100 hover:to-amber-100'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      {/* Notification badge overlay */}
                      {hasUnreadMessages && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="flex h-7 w-7 animate-bounce items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold text-white shadow-lg">
                            {unreadCtoMessages}
                          </div>
                        </div>
                      )}

                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {/* Enhanced notification indicator */}
                          {hasUnreadMessages && (
                            <div className="relative flex h-5 w-5 items-center justify-center">
                              <div className="absolute h-5 w-5 animate-ping rounded-full bg-orange-400 opacity-75"></div>
                              <div className="relative h-3 w-3 rounded-full bg-orange-500"></div>
                            </div>
                          )}

                          <span className="text-lg">{getStatusIcon(status)}</span>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            {ticket.assignedBy}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
                          >
                            {getStatusText(status)}
                          </span>

                          {/* Enhanced unread message count badge */}
                          {hasUnreadMessages && (
                            <span className="inline-flex animate-pulse items-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                              🔔 {unreadCtoMessages} from CTO
                            </span>
                          )}

                          {selectedTicket?.id === ticket.id && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                              Selected
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(ticket.assignedAt)}
                        </span>
                      </div>
                      <h3
                        className={`mb-1 font-medium ${
                          hasUnreadMessages ? 'font-bold text-gray-900' : 'text-gray-900'
                        }`}
                      >
                        {hasUnreadMessages && '🔔 '}
                        {ticket.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-gray-600">{ticket.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-500">Assigned to: {ticket.employeeName}</p>
                        <span className="text-xs text-gray-400">
                          {new Date(ticket.assignedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Ticket Details and Chat */}
          <div className="rounded-lg bg-white p-6 shadow-md lg:col-span-2">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {selectedTicket ? 'Ticket Details & Chat' : 'Select a Ticket'}
              </h1>
              <p className="text-gray-600">
                {selectedTicket
                  ? 'View details and communicate about this ticket'
                  : 'Choose a ticket from the list to view details'}
              </p>
            </div>

            {/* Confirmation Message */}
            {showConfirmation && (
              <div className="mb-4 rounded border border-blue-400 bg-blue-100 p-4 text-blue-700">
                <div className="flex items-center">
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    Great! Your CTO has been notified that you're ready to discuss.
                  </span>
                </div>
              </div>
            )}

            {/* Ticket Display */}
            {selectedTicket ? (
              <div className="space-y-6">
                {/* Ticket Header */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        Active Ticket
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ticketStatuses[selectedTicket.id] || 'assigned')}`}
                      >
                        {getStatusText(ticketStatuses[selectedTicket.id] || 'assigned')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(selectedTicket.assignedAt)}
                    </span>
                  </div>
                </div>

                {/* Ticket Content */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <h2 className="mb-2 text-lg font-semibold text-gray-900">
                      {selectedTicket.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">Description</h3>
                    <div className="rounded-md bg-gray-50 p-4">
                      <p className="whitespace-pre-wrap text-gray-800">
                        {selectedTicket.description}
                      </p>
                    </div>
                  </div>

                  {/* Assignment Info */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Assigned by: <strong>{selectedTicket.assignedBy}</strong>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Assigned to: <strong>{selectedTicket.employeeName}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <button
                    onClick={handleReadyToDiscuss}
                    disabled={isReadyToDiscuss}
                    className={`w-full rounded-md px-4 py-3 font-medium transition-colors ${
                      isReadyToDiscuss
                        ? 'cursor-not-allowed bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
                    }`}
                  >
                    {isReadyToDiscuss ? (
                      <div className="flex items-center justify-center">
                        <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Ready to Discuss ✓
                      </div>
                    ) : (
                      "I'm ready to discuss"
                    )}
                  </button>

                  {/* Mark as Finished Button */}
                  {isReadyToDiscuss &&
                    (ticketStatuses[selectedTicket.id] === 'in_progress' ||
                      ticketStatuses[selectedTicket.id] === 'assigned') && (
                      <button
                        onClick={handleMarkAsFinished}
                        className="w-full rounded-md bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Mark as Finished 🎉
                        </div>
                      </button>
                    )}

                  {/* Finished State Display */}
                  {ticketStatuses[selectedTicket.id] === 'finished' && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center">
                        <svg
                          className="mr-2 h-5 w-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-green-800">
                          Work Completed! 🎉 Your CTO has been notified.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Reviewed State Display */}
                  {ticketStatuses[selectedTicket.id] === 'reviewed' && (
                    <div className="rounded-md border border-purple-200 bg-purple-50 p-4">
                      <div className="flex items-center">
                        <svg
                          className="mr-2 h-5 w-5 text-purple-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-purple-800">
                          ✅ Reviewed and Approved by CTO
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Component */}
                {isReadyToDiscuss && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Discussion Chat</h3>
                      {ticketStatuses[selectedTicket.id] === 'finished' && (
                        <span className="rounded bg-green-50 px-2 py-1 text-sm text-gray-500">
                          Work finished - waiting for review
                        </span>
                      )}
                    </div>

                    {/* Chat Messages */}
                    <div className="mb-4 h-64 overflow-y-auto rounded-lg bg-gray-50 p-4">
                      {chatMessages.length === 0 ? (
                        <div className="mt-8 text-center text-sm text-gray-500">
                          <svg
                            className="mx-auto mb-2 h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {chatMessages.map((msg) => (
                            <div key={msg.id} className="flex flex-col">
                              <div className="mb-1 flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-600">
                                  {msg.sender}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <div
                                className={`max-w-xs rounded-lg p-3 ${
                                  msg.sender === 'John Doe' || msg.sender === 'Employee'
                                    ? 'ml-auto bg-blue-500 text-white'
                                    : msg.sender === 'CTO'
                                      ? 'bg-purple-500 text-white'
                                      : 'border bg-white text-gray-800'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!currentMessage.trim()}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* No Tickets State */
              <div className="py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No ticket selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a ticket from the list to view its details and start chatting.
                </p>
              </div>
            )}

            {/* Debug Section */}
            <div className="mt-8 border-t border-gray-200 pt-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                Debug Information & Testing
              </h3>
              <div className="space-y-2 rounded bg-gray-50 p-3 text-xs">
                <div className="rounded border-l-4 border-blue-400 bg-blue-50 p-2">
                  <p className="font-medium text-blue-800">
                    🧪 How to Test Employee ↔ CTO Communication:
                  </p>
                  <ol className="mt-1 ml-4 list-decimal text-blue-700">
                    <li>Select a ticket from the list on the left</li>
                    <li>Click "I'm ready to discuss" to enable chat</li>
                    <li>Click "Mark as Finished" when work is complete</li>
                    <li>Open CTO page in another tab to see notifications</li>
                    <li>CTO messages will automatically unmark finished status</li>
                  </ol>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-600">Data Status:</p>
                    <p className="text-gray-600">
                      Total tickets:{' '}
                      {typeof window !== 'undefined' ? window.mockTickets?.length || 0 : 0}
                    </p>
                    <p className="text-gray-600">Chat messages: {chatMessages.length}</p>
                    <p className="text-gray-600">
                      Selected ticket: {selectedTicket?.title || 'None'}
                    </p>
                    <p className="text-gray-600">
                      Ticket status:{' '}
                      {selectedTicket
                        ? getStatusText(ticketStatuses[selectedTicket.id] || 'assigned')
                        : 'None'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Console Commands:</p>
                    <p className="text-gray-500">
                      <code>window.mockTickets</code>
                    </p>
                    <p className="text-gray-500">
                      <code>window.ticketStatuses</code>
                    </p>
                    <p className="text-gray-500">
                      <code>window.statusNotifications</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
