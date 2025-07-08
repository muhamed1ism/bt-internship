import { useState, useEffect } from 'react';
import { getMyTickets, Ticket } from '../api/ticket-api';
import { useChat } from '../hooks/useChat';

export const EmployeeTicketTest = () => {
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
            <p className="text-gray-500">
              {searchTerm
                ? 'No tickets match your search criteria.'
                : 'No tickets assigned to you yet.'}
            </p>
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

        {/* Chat Panel */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">
            {selectedTicket ? `Chat: ${selectedTicket.title}` : 'Select a ticket to chat'}
          </h2>
          {selectedTicket ? (
            <div className="flex h-96 flex-col">
              <div className="mb-4 rounded bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-800">{selectedTicket.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{selectedTicket.description}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Assigned by: {selectedTicket.assignedBy} on{' '}
                  {formatDateTime(selectedTicket.createdAt)}
                </p>
              </div>
              <div className="mb-4 flex-1 overflow-y-auto rounded bg-gray-50 p-4">
                {chatLoading ? (
                  <div className="text-center text-gray-500">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`rounded-lg p-3 ${
                          message.sender.includes('CTO') ? 'mr-8 bg-blue-100' : 'ml-8 bg-white'
                        }`}
                      >
                        <div className="mb-1 flex items-start justify-between">
                          <span className="text-sm font-semibold">{message.sender}</span>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || chatLoading}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              Select a ticket from the list to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
