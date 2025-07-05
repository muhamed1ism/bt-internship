import { useState, useEffect } from 'react';

// Define the ticket type
interface Ticket {
  id: string;
  employeeName: string;
  title: string;
  description: string;
  assignedAt: Date;
  assignedBy: string;
}

// Chat message types
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

// Initialize mock tickets storage on window object
declare global {
  interface Window {
    mockTickets: Ticket[];
    chatHistory: Record<string, ChatMessage[]>;
    chatMemory: Record<string, Array<{ sender: string; message: string; timestamp?: Date }>>;
    ticketStatuses: Record<string, TicketStatus>;
    statusNotifications: Record<string, Notification[]>;
  }
}

// Initialize the mock tickets array if it doesn't exist
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
}

export const CtoTicketTest = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    title: '',
    description: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chat states
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({});
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [ticketStatuses, setTicketStatuses] = useState<Record<string, TicketStatus>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load conversations and active tickets on component mount
  useEffect(() => {
    const loadConversations = () => {
      if (typeof window !== 'undefined') {
        const tickets = window.mockTickets || [];
        const chatHistory = window.chatHistory || {};

        // Find tickets that have active conversations
        const ticketsWithChats = tickets.filter(
          (ticket) => chatHistory[ticket.id] && chatHistory[ticket.id].length > 0,
        );

        setActiveTickets(ticketsWithChats);
        setConversations(chatHistory);
      }
    };

    const loadTicketStatuses = () => {
      if (typeof window !== 'undefined' && window.ticketStatuses) {
        setTicketStatuses(window.ticketStatuses);
      }
    };

    const loadNotifications = () => {
      if (typeof window !== 'undefined' && window.statusNotifications) {
        // Collect all notifications from all tickets
        const allNotifications: Notification[] = [];
        Object.values(window.statusNotifications).forEach((ticketNotifications) => {
          allNotifications.push(...ticketNotifications);
        });

        // Sort by timestamp (newest first)
        allNotifications.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

        setNotifications(allNotifications.slice(0, 5)); // Show only latest 5
      }
    };

    loadConversations();
    loadTicketStatuses();
    loadNotifications();

    // Listen for new messages from employee page
    const handleNewMessage = () => {
      loadConversations();
    };

    // Listen for status changes
    const handleStatusChange = () => {
      loadTicketStatuses();
      loadNotifications();
    };

    window.addEventListener('storage', handleNewMessage);
    window.addEventListener('newChatMessage', handleNewMessage);
    window.addEventListener('ticketStatusChange', handleStatusChange);

    return () => {
      window.removeEventListener('storage', handleNewMessage);
      window.removeEventListener('newChatMessage', handleNewMessage);
      window.removeEventListener('ticketStatusChange', handleStatusChange);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create new ticket
    const newTicket: Ticket = {
      id: Date.now().toString(),
      employeeName: formData.employeeName,
      title: formData.title,
      description: formData.description,
      assignedAt: new Date(),
      assignedBy: 'CTO',
    };

    // Save to mock storage
    if (typeof window !== 'undefined') {
      window.mockTickets.push(newTicket);
      // Initialize ticket status as 'assigned'
      window.ticketStatuses[newTicket.id] = 'assigned';
    }

    // Reset form
    setFormData({
      employeeName: '',
      title: '',
      description: '',
    });

    // Show success message
    setShowSuccess(true);
    setIsSubmitting(false);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedTicketId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      ticketId: selectedTicketId,
      sender: 'CTO',
      message: chatMessage.trim(),
      timestamp: new Date(),
      type: 'cto',
    };

    if (typeof window !== 'undefined') {
      // Add to full chat history
      if (!window.chatHistory[selectedTicketId]) {
        window.chatHistory[selectedTicketId] = [];
      }
      window.chatHistory[selectedTicketId].push(newMessage);

      // Add to simple chat memory
      if (!window.chatMemory[selectedTicketId]) {
        window.chatMemory[selectedTicketId] = [];
      }
      window.chatMemory[selectedTicketId].push({
        sender: 'CTO',
        message: chatMessage.trim(),
        timestamp: new Date(),
      });

      // Auto-unfinish ticket when CTO sends message
      if (window.ticketStatuses[selectedTicketId] === 'finished') {
        window.ticketStatuses[selectedTicketId] = 'in_progress';

        // Add notification about status change
        if (!window.statusNotifications[selectedTicketId]) {
          window.statusNotifications[selectedTicketId] = [];
        }

        const statusNotification: Notification = {
          id: Date.now().toString() + '_status',
          message: `Ticket "${window.mockTickets.find((t) => t.id === selectedTicketId)?.title}" status changed to "In Progress" due to CTO message`,
          type: 'info',
          timestamp: new Date(),
        };

        window.statusNotifications[selectedTicketId].push(statusNotification);

        // Trigger status change event
        window.dispatchEvent(new CustomEvent('ticketStatusChange'));
      }

      // Update local state from the global state to avoid duplication
      setConversations((prev) => ({
        ...prev,
        [selectedTicketId]: window.chatHistory[selectedTicketId],
      }));

      // Trigger real-time update
      window.dispatchEvent(new CustomEvent('newChatMessage'));
    }

    setChatMessage('');
  };

  const handleMarkAsReviewed = () => {
    if (!selectedTicketId) return;

    if (typeof window !== 'undefined') {
      // Update ticket status to reviewed
      window.ticketStatuses[selectedTicketId] = 'reviewed';

      // Add notification
      if (!window.statusNotifications[selectedTicketId]) {
        window.statusNotifications[selectedTicketId] = [];
      }

      const notification: Notification = {
        id: Date.now().toString(),
        message: `CTO has reviewed and approved "${window.mockTickets.find((t) => t.id === selectedTicketId)?.title}"`,
        type: 'success',
        timestamp: new Date(),
      };

      window.statusNotifications[selectedTicketId].push(notification);

      // Trigger status change event
      window.dispatchEvent(new CustomEvent('ticketStatusChange'));
    }

    // Update local state
    setTicketStatuses((prev) => ({
      ...prev,
      [selectedTicketId]: 'reviewed',
    }));
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

  const clearNotifications = () => {
    if (typeof window !== 'undefined') {
      window.statusNotifications = {};
      setNotifications([]);
    }
  };

  const isFormValid =
    formData.employeeName.trim() && formData.title.trim() && formData.description.trim();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Notifications Panel */}
        {notifications.length > 0 && (
          <div className="mb-6 rounded-lg border-l-4 border-blue-500 bg-white p-4 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                🔔 Status Notifications ({notifications.length})
              </h3>
              <button
                onClick={clearNotifications}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>
            <div className="max-h-32 space-y-2 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded p-2 text-sm ${
                    notification.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : notification.type === 'info'
                        ? 'bg-blue-50 text-blue-800'
                        : 'bg-yellow-50 text-yellow-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span>{notification.message}</span>
                    <span className="ml-2 text-xs opacity-75">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Ticket Assignment Form */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">CTO Ticket Assignment</h1>
              <p className="text-gray-600">Test page for assigning tickets to employees</p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-4 rounded border border-green-400 bg-green-100 p-4 text-green-700">
                <div className="flex items-center">
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Ticket assigned successfully!</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Employee Name */}
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter employee name"
                  required
                />
              </div>

              {/* Ticket Title */}
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter ticket title"
                  required
                />
              </div>

              {/* Ticket Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Ticket Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter ticket description"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSubmitting ? 'Assigning...' : 'Assign Ticket'}
              </button>
            </form>

            {/* Debug Section */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">Debug Information</h3>
              <div className="space-y-1 rounded bg-gray-50 p-3 text-xs">
                <p className="text-gray-600">
                  Total tickets stored:{' '}
                  {typeof window !== 'undefined' ? window.mockTickets?.length || 0 : 0}
                </p>
                <p className="text-gray-600">Active conversations: {activeTickets.length}</p>
                <p className="text-gray-600">Pending notifications: {notifications.length}</p>
                <p className="mt-1 text-gray-500">
                  Check browser console: <code>window.mockTickets</code>
                </p>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Active Conversations</h2>
              <p className="text-gray-600">Chat with employees about their tickets</p>
            </div>

            {/* Active Tickets List */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-700">Select Conversation</h3>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {activeTickets.length === 0 ? (
                  <p className="py-4 text-center text-gray-500">No active conversations yet</p>
                ) : (
                  activeTickets.map((ticket) => {
                    const status = ticketStatuses[ticket.id] || 'assigned';
                    const messageCount = conversations[ticket.id]?.length || 0;

                    return (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`w-full rounded border p-3 text-left transition-colors ${
                          selectedTicketId === ticket.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <p className="font-medium">{ticket.employeeName}</p>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
                              >
                                {getStatusText(status)}
                              </span>
                              {status === 'finished' && (
                                <span className="text-xs font-medium text-orange-600">
                                  ⏳ Needs Review
                                </span>
                              )}
                            </div>
                            <p className="truncate text-sm text-gray-600">{ticket.title}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">{messageCount} messages</div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Messages */}
            {selectedTicketId && (
              <div className="mb-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">Conversation</h3>
                  <div className="flex items-center gap-2">
                    {ticketStatuses[selectedTicketId] === 'finished' && (
                      <button
                        onClick={handleMarkAsReviewed}
                        className="rounded-md bg-purple-600 px-3 py-1 text-sm text-white transition-colors hover:bg-purple-700"
                      >
                        ✅ Mark as Reviewed
                      </button>
                    )}
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getStatusColor(ticketStatuses[selectedTicketId] || 'assigned')}`}
                    >
                      {getStatusText(ticketStatuses[selectedTicketId] || 'assigned')}
                    </span>
                  </div>
                </div>
                <div className="h-64 overflow-y-auto rounded-lg border bg-gray-50 p-4">
                  {conversations[selectedTicketId]?.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-3 flex ${message.type === 'cto' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          message.type === 'cto'
                            ? 'bg-purple-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        <div className="text-sm font-medium">{message.sender}</div>
                        <div className="text-sm whitespace-pre-wrap">{message.message}</div>
                        <div className="mt-1 text-xs opacity-75">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            {selectedTicketId && (
              <div className="space-y-3">
                {/* Auto-unfinish warning */}
                {ticketStatuses[selectedTicketId] === 'finished' && (
                  <div className="rounded border border-orange-200 bg-orange-50 p-2 text-sm text-orange-600">
                    💡 Note: Sending a message will automatically change the ticket status from
                    "Finished" to "In Progress"
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim()}
                    className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
