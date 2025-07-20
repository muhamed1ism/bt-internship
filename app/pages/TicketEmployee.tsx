import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  useRealtimeChat,
  useRealtimeMyTickets,
  useRealtimeTicket,
} from '@app/features/tickets/hooks';
import { Ticket } from '@app/types/ticket';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';

export const TicketEmployee = () => {
  const { user: currentUser } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  // Use real-time ticket management
  const { tickets, isLoading } = useRealtimeMyTickets();

  // Use real-time selected ticket details
  const {
    ticket: realtimeTicket,
    markAsAwaitingConfirmation,
    isMarkingAsFinished,
    canMarkFinished,
  } = useRealtimeTicket(selectedTicket?.id || null);

  // Use the real-time ticket data if available, fallback to selected ticket
  const currentTicket = realtimeTicket || selectedTicket;

  const {
    messages,
    sendMessage,
    isLoading: chatLoading,
    messagesEndRef,
    containerRef,
    isSending,
    scrollToBottom,
  } = useRealtimeChat(currentTicket?.id || null);

  const [newMessage, setNewMessage] = useState('');

  const handleMarkAsFinished = async () => {
    if (!currentTicket || !canMarkFinished) return;

    try {
      await markAsAwaitingConfirmation(currentTicket.id);
    } catch (error) {
      console.error('Failed to mark ticket as finished:', error);
    }
  };

  const toggleDescription = (ticketId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId);
    } else {
      newExpanded.add(ticketId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ONGOING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AWAITING_CONFIRMATION':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FINISHED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'ONGOING':
        return 'In Progress';
      case 'AWAITING_CONFIRMATION':
        return 'Awaiting Confirmation';
      case 'FINISHED':
        return 'Finished';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '⏳';
      case 'ONGOING':
        return '🔄';
      case 'AWAITING_CONFIRMATION':
        return '⏱️';
      case 'FINISHED':
        return '✅';
      default:
        return '📋';
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
  const isMyMessage = (senderId: string) => {
    if (!currentUser) return false;
    return senderId === currentUser.id;
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">My Assigned Tickets</h1>
          <p className="text-gray-600">Manage and track your assigned work tickets</p>

          <div className="mt-6 flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-primary/30 bg-card h-9 w-full rounded-lg border pr-4 pl-10 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="bg-card border-primary/30 w-34">
                <SelectValue defaultValue={sortBy} placeholder="Sort by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date" onClick={() => setSortBy('date')}>
                  Sort by Date
                </SelectItem>
                <SelectItem value="title" onClick={() => setSortBy('date')}>
                  Sort by Title
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Tickets List */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Your Tickets</h2>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {filteredTickets.length} tickets
                </span>
              </div>
            </div>

            <div className="p-6">
              {filteredTickets.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="h-full w-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">No tickets found</h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? 'No tickets match your search criteria.'
                      : 'No tickets assigned to you yet.'}
                  </p>
                </div>
              ) : (
                <div className="max-h-96 space-y-4 overflow-y-auto">
                  {filteredTickets.map((ticket) => {
                    const isExpanded = expandedDescriptions.has(ticket.id);
                    const shouldTruncate = ticket.description.length > 120;

                    return (
                      <div
                        key={ticket.id}
                        className={`group cursor-pointer rounded-lg border-2 p-5 transition-all duration-200 hover:shadow-md ${
                          selectedTicket?.id === ticket.id
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-center gap-3">
                              <h3 className="truncate text-lg font-semibold text-gray-900">
                                {ticket.title}
                              </h3>
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}
                              >
                                <span className="mr-1">{getStatusIcon(ticket.status)}</span>
                                {getStatusText(ticket.status)}
                              </span>
                            </div>
                          </div>
                          <span className="ml-4 text-sm whitespace-nowrap text-gray-500">
                            {getTimeAgo(ticket.createdAt)}
                          </span>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm leading-relaxed text-gray-600">
                            {shouldTruncate && !isExpanded
                              ? ticket.description.substring(0, 120) + '...'
                              : ticket.description}
                          </p>
                          {shouldTruncate && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDescription(ticket.id);
                              }}
                              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              {isExpanded ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500">
                            <div className="flex items-center">
                              <svg
                                className="mr-1 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <span>
                                Assigned by: {ticket.author.firstName} {ticket.author.lastName}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <svg
                              className="mr-1 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{formatDateTime(ticket.createdAt)}</span>
                          </div>
                        </div>

                        {ticket.messages && ticket.messages.length > 0 && (
                          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <div className="mb-1 flex items-center gap-2">
                              <svg
                                className="h-4 w-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span className="text-xs font-medium text-gray-700">
                                Latest message:
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {ticket.messages[0].content.substring(0, 80)}
                              {ticket.messages[0].content.length > 80 ? '...' : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Chat Panel */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedTicket ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                      <span>Active Chat</span>
                    </div>
                  </div>
                ) : (
                  'Select a ticket to chat'
                )}
              </h2>
              {selectedTicket && (
                <p className="mt-1 text-sm text-gray-600">
                  Communication with {selectedTicket.author.firstName}{' '}
                  {selectedTicket.author.lastName}
                </p>
              )}
            </div>

            {selectedTicket ? (
              <div className="flex h-[600px] flex-col">
                {/* Enhanced Ticket Details */}
                <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {selectedTicket.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(selectedTicket.status)}`}
                      >
                        <span className="mr-2">{getStatusIcon(selectedTicket.status)}</span>
                        {getStatusText(selectedTicket.status)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3 rounded-lg border border-gray-200 bg-white p-3">
                    <h4 className="mb-1 text-sm font-medium text-gray-900">Description</h4>
                    <p className="max-h-16 overflow-y-auto text-xs leading-relaxed text-gray-700">
                      {selectedTicket.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="mr-1 h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>
                        Assigned by: {selectedTicket.author.firstName}{' '}
                        {selectedTicket.author.lastName}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <svg
                        className="mr-1 h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{formatDateTime(selectedTicket.createdAt)}</span>
                    </div>
                  </div>

                  {selectedTicket.status !== 'FINISHED' &&
                    selectedTicket.status !== 'AWAITING_CONFIRMATION' && (
                      <div className="mt-3 border-t border-gray-200 pt-3">
                        <button
                          onClick={handleMarkAsFinished}
                          disabled={isMarkingAsFinished}
                          className="inline-flex items-center rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isMarkingAsFinished ? (
                            <>
                              <svg
                                className="mr-2 -ml-1 h-3 w-3 animate-spin text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Marking as Finished...
                            </>
                          ) : (
                            <>
                              <svg
                                className="mr-2 h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Mark as Finished
                            </>
                          )}
                        </button>
                      </div>
                    )}
                </div>

                {/* Messages Area */}
                <div ref={containerRef} className="flex-1 overflow-y-auto bg-gray-50 p-4">
                  {chatLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-gray-600">Loading messages...</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center">
                      <div>
                        <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className="h-full w-full"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </div>
                        <h3 className="mb-2 text-sm font-medium text-gray-900">No messages yet</h3>
                        <p className="text-xs text-gray-500">
                          Start the conversation with your manager!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isCurrentUser = isMyMessage(message.senderId);
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`flex max-w-xs items-end space-x-3 lg:max-w-md ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                            >
                              {/* Avatar */}
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white shadow-md ${
                                  isCurrentUser ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                              >
                                {getInitials(
                                  `${message.senderUser.firstName} ${message.senderUser.lastName}`,
                                )}
                              </div>

                              {/* Message Bubble */}
                              <div
                                className={`rounded-2xl px-3 py-2 shadow-sm ${
                                  isCurrentUser
                                    ? 'rounded-br-md bg-green-500 text-white'
                                    : 'rounded-bl-md border bg-white text-gray-800'
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <p
                                  className={`mt-1 text-xs ${
                                    isCurrentUser ? 'text-green-100' : 'text-gray-500'
                                  }`}
                                >
                                  {formatTime(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {/* Scroll anchor */}
                      <div ref={messagesEndRef} />
                    </div>
                  )}

                  {/* Scroll to bottom button */}
                  {messages.length > 0 && (
                    <div className="absolute right-4 bottom-20">
                      <button
                        onClick={() => scrollToBottom()}
                        className="rounded-full bg-gray-600 p-2 text-white shadow-lg transition-colors hover:bg-gray-700"
                        title="Scroll to bottom"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Enhanced Message Input */}
                <div className="border-t border-gray-100 bg-white p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={
                          selectedTicket.status === 'FINISHED'
                            ? 'Ticket is finished - no more messages allowed'
                            : 'Type your message...'
                        }
                        disabled={selectedTicket.status === 'FINISHED'}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={
                        !newMessage.trim() ||
                        chatLoading ||
                        isSending ||
                        selectedTicket.status === 'FINISHED'
                      }
                      className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSending ? (
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex h-[600px] items-center justify-center text-center">
                <div>
                  <div className="mx-auto mb-6 h-20 w-20 text-gray-400">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="h-full w-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-medium text-gray-900">
                    Select a ticket to start chatting
                  </h3>
                  <p className="text-gray-500">
                    Choose a ticket from the list to communicate with your manager
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
