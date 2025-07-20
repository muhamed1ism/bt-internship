import { useState, useEffect } from 'react';
import { getAllUsersApi } from '@app/api/user-api';
import { useAuth } from '@app/context/AuthContext';
import { Ticket } from '@app/types/ticket';
import { DEFAULT_CREATE_TICKET_FORM, MESSAGE_PLACEHOLDERS } from '@app/constants/ticket';
import {
  useRealtimeAllTickets,
  useRealtimeChat,
  useRealtimeTicket,
} from '@app/features/tickets/hooks';
import { User } from '@app/types/types';
import { TicketCard } from '@app/features/tickets/components/TicketCard';
import { TicketStatusBadge } from '@app/features/tickets/components/TicketStatusBadge';
import { formatDateTime, isMessageOwner } from '@app/features/tickets/utils/ticketHelpers';
import { ChatMessage } from '@app/features/tickets/components/ChatMessage';
import { MessageInput } from '@app/features/tickets/components/MessageInput';
import { CreateTicketValue } from '@app/schemas/ticketSchema';
import { useAbility } from '@casl/react';
import { AbilityContext } from '@app/casl/AbilityContext';
import { Navigate } from 'react-router-dom';
import routeNames from '@app/routes/route-names';

export const CtoTickets = () => {
  const ability = useAbility(AbilityContext);
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [employeeId, setEmployeeId] = useState<string>('');
  const [createForm, setCreateForm] = useState<CreateTicketValue>(DEFAULT_CREATE_TICKET_FORM);
  const [newMessage, setNewMessage] = useState('');

  if (ability.cannot('manage', 'Ticket')) {
    <Navigate to={routeNames.notAuthorized()} />;
  }

  // Real-time ticket management
  const { tickets, ticketCounts, isLoading, createNewTicket, isCreating, hasAwaitingConfirmation } =
    useRealtimeAllTickets();

  // Real-time selected ticket details
  const {
    ticket: realtimeTicket,
    markTicketFinished,
    isConfirming,
    isMarkingFinished,
    canConfirm,
    canMarkFinished,
  } = useRealtimeTicket(selectedTicket?.id || null);

  // Use the real-time ticket data if available, fallback to selected ticket
  const currentTicket = realtimeTicket || selectedTicket;

  // Real-time chat
  const {
    messages,
    sendMessage,
    isLoading: chatLoading,
    messagesEndRef,
    containerRef,
    isSending,
    scrollToBottom,
  } = useRealtimeChat(currentTicket?.id || null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userData = await getAllUsersApi();
      if (userData) {
        setUsers(userData);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNewTicket(employeeId, createForm);
      setCreateForm(DEFAULT_CREATE_TICKET_FORM);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentTicket) return;

    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleConfirmFinished = async () => {
    if (!currentTicket || !canConfirm) return;
    try {
      await markTicketFinished(currentTicket.id);
    } catch (error) {
      console.error('Failed to confirm ticket finished:', error);
    }
  };

  const handleMarkAsFinishedByCTO = async () => {
    if (!currentTicket || !canMarkFinished) return;
    try {
      await markTicketFinished(currentTicket.id);
    } catch (error) {
      console.error('Failed to mark ticket as finished by CTO:', error);
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

  const getCurrentUserId = () => {
    if (!currentUser) return '';
    return currentUser.id;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
              <p className="mt-2 text-gray-600">
                Manage and track all tickets across your organization
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Ticket
            </button>
          </div>
        </div>

        {/* Confirmation Alert */}
        {hasAwaitingConfirmation && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  {ticketCounts.awaitingConfirmation} ticket(s) need your confirmation
                </h3>
                <p className="text-sm text-amber-700">
                  Employees have marked these tickets as finished and are waiting for your approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
              <p className="mt-1 text-sm text-gray-600">Assign a new task to a team member</p>
            </div>
            <form onSubmit={handleCreateTicket} className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Ticket Title
                  </label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a clear, descriptive title"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed information about the task..."
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Assign to Employee
                  </label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select an employee</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="inline-flex items-center rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Tickets List */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">All Tickets</h2>
                <div className="flex items-center gap-3">
                  {hasAwaitingConfirmation && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                      🔔 {ticketCounts.awaitingConfirmation} need confirmation
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {tickets.length} total
                  </span>
                </div>
              </div>
              {/* Status breakdown */}
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-600">
                    {ticketCounts.pending}
                  </div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">{ticketCounts.ongoing}</div>
                  <div className="text-xs text-gray-500">Ongoing</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">
                    {ticketCounts.awaitingConfirmation}
                  </div>
                  <div className="text-xs text-gray-500">Awaiting</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {ticketCounts.finished}
                  </div>
                  <div className="text-xs text-gray-500">Finished</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {tickets.length === 0 ? (
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
                  <p className="text-gray-500">Create your first ticket to get started!</p>
                </div>
              ) : (
                <div className="max-h-96 space-y-4 overflow-y-auto">
                  {tickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      isSelected={selectedTicket?.id === ticket.id}
                      onSelect={setSelectedTicket}
                      onToggleDescription={toggleDescription}
                      isDescriptionExpanded={expandedDescriptions.has(ticket.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ticket Details & Chat */}
          {selectedTicket ? (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex h-[600px] flex-col">
                {/* Ticket Details */}
                <div className="border-b border-gray-100 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{currentTicket?.title}</h2>
                    <TicketStatusBadge status={currentTicket?.status || 'PENDING'} />
                  </div>

                  <div className="max-h-16 overflow-y-auto">
                    <p className="text-sm text-gray-600">{currentTicket?.description}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                    <div>
                      👤 {currentTicket?.employee.firstName} {currentTicket?.employee.lastName}
                    </div>
                    <div>📧 {currentTicket?.employee.email}</div>
                    <div>📅 {formatDateTime(currentTicket?.createdAt || '')}</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    {currentTicket?.status === 'AWAITING_CONFIRMATION' && (
                      <button
                        onClick={handleConfirmFinished}
                        disabled={isConfirming}
                        className="inline-flex items-center rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                      >
                        {isConfirming ? 'Confirming...' : '✅ Confirm Finished'}
                      </button>
                    )}

                    {currentTicket?.status !== 'FINISHED' && (
                      <button
                        onClick={handleMarkAsFinishedByCTO}
                        disabled={isMarkingFinished}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isMarkingFinished ? 'Marking...' : '🔄 Mark as Finished'}
                      </button>
                    )}
                  </div>
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
                          Start the conversation with your team member!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <ChatMessage
                          key={message.id}
                          message={message}
                          isCurrentUser={isMessageOwner(message.senderId, getCurrentUserId())}
                        />
                      ))}
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

                {/* Message Input */}
                <MessageInput
                  value={newMessage}
                  onChange={setNewMessage}
                  onSubmit={handleSendMessage}
                  placeholder={
                    currentTicket?.status === 'FINISHED'
                      ? MESSAGE_PLACEHOLDERS.FINISHED_TICKET
                      : MESSAGE_PLACEHOLDERS.CTO_CONVERSATION
                  }
                  disabled={currentTicket?.status === 'FINISHED'}
                  isLoading={isSending}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex h-[600px] items-center justify-center text-center">
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
                        d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h10a2 2 0 002-2V8m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">Select a ticket</h3>
                  <p className="text-gray-500">
                    Choose a ticket from the list to view details and chat
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
