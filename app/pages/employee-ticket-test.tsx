import { useState, useEffect } from 'react';
import { getMyTickets, Ticket } from '../api/ticket-api';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../context/AuthContext';

export const EmployeeTicketTest = () => {
  const { user: currentUser } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const { messages, sendMessage, isLoading: chatLoading } = useChat(selectedTicket?.id || null);

  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadMyTickets();
  }, []);

  const loadMyTickets = async () => {
    try {
      const ticketData = await getMyTickets();
      setTickets(ticketData);
    } catch (error) {
      console.error('Failed to load your tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Fix message ownership detection
  const isMyMessage = (sender: string) => {
    if (!currentUser) return false;
    const currentUserName = `${currentUser.firstName} ${currentUser.lastName}`;
    return sender === currentUserName;
  };

  const getTimeAgo = (dateString: string) => {
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

  const filteredTickets = tickets
    .filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading your tickets...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">My Assigned Tickets</h1>
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
            className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tickets List */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Your Tickets ({filteredTickets.length})</h2>
          {filteredTickets.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <div className="mb-2 text-4xl">📋</div>
              <p>
                {searchTerm
                  ? 'No tickets match your search criteria.'
                  : 'No tickets assigned to you yet.'}
              </p>
            </div>
          ) : (
            <div className="max-h-96 space-y-4 overflow-y-auto">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                    selectedTicket?.id === ticket.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800">{ticket.title}</h3>
                    <span className="text-xs text-gray-500">{getTimeAgo(ticket.createdAt)}</span>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">
                    {ticket.description.substring(0, 100)}
                    {ticket.description.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Assigned by: {ticket.assignedBy}</span>
                    <span className="text-xs text-gray-400">
                      Created: {formatDateTime(ticket.createdAt)}
                    </span>
                  </div>
                  {ticket.messages && ticket.messages.length > 0 && (
                    <div className="mt-2 rounded bg-gray-50 p-2 text-xs">
                      <span className="font-semibold">Latest:</span>{' '}
                      {ticket.messages[0].content.substring(0, 50)}
                      {ticket.messages[0].content.length > 50 ? '...' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Chat Panel */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="border-b bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedTicket ? (
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>{selectedTicket.title}</span>
                </div>
              ) : (
                'Select a ticket to chat'
              )}
            </h2>
            {selectedTicket && (
              <p className="mt-1 text-sm text-gray-600">Chat with {selectedTicket.assignedBy}</p>
            )}
          </div>

          {selectedTicket ? (
            <div className="flex h-96 flex-col">
              {/* Ticket Details */}
              <div className="border-b bg-blue-50 p-4">
                <h3 className="text-sm font-semibold text-gray-800">{selectedTicket.title}</h3>
                <p className="mt-1 text-xs text-gray-600">{selectedTicket.description}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Assigned by: {selectedTicket.assignedBy} on{' '}
                  {formatDateTime(selectedTicket.createdAt)}
                </p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
                {chatLoading ? (
                  <div className="py-8 text-center text-gray-500">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                    <p className="mt-2">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <div className="mb-2 text-4xl">💬</div>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isCurrentUser = isMyMessage(message.sender);
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`flex max-w-xs items-end space-x-2 lg:max-w-md ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                          >
                            {/* Avatar */}
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${
                                isCurrentUser ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                            >
                              {getInitials(message.sender)}
                            </div>

                            {/* Message Bubble */}
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isCurrentUser
                                  ? 'rounded-br-md bg-green-500 text-white'
                                  : 'rounded-bl-md border bg-white text-gray-800 shadow-sm'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`mt-1 text-xs ${
                                  isCurrentUser ? 'text-green-100' : 'text-gray-500'
                                }`}
                              >
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="border-t bg-white p-4">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || chatLoading}
                    className="rounded-full bg-green-500 px-6 py-2 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <div className="mb-4 text-6xl">📋</div>
              <p className="text-lg">Select a ticket from the list to start chatting</p>
              <p className="mt-2 text-sm">Choose a ticket to communicate with your manager</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
