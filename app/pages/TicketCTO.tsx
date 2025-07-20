import { useState, useEffect } from 'react';
import { getAllUsersApi } from '@app/api/user-api';
import { useAuth } from '@app/context/AuthContext';
import { User } from '@app/types/types';
import { Ticket } from '@app/types/ticket';
import { CreateTicketValue } from '@app/schemas/ticketSchema';
import {
  useRealtimeAllTickets,
  useRealtimeChat,
  useRealtimeTicket,
} from '@app/features/tickets/hooks';
import { Button } from '@app/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useAbility } from '@casl/react';
import { AbilityContext } from '@app/casl/AbilityContext';
import { useNavigate } from 'react-router-dom';
import routeNames from '@app/routes/route-names';

// Interfaces now imported from @app/features/tickets

export const TicketCTO = () => {
  const navigate = useNavigate();
  const ability = useAbility(AbilityContext);

  if (ability.cannot('read', 'Tickets')) {
    navigate(routeNames.notAuthorized());
  }

  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [createForm, setCreateForm] = useState<CreateTicketValue>({
    title: '',
    description: '',
  });

  // Use real-time ticket management
  const { tickets, ticketCounts, isLoading, createNewTicket, isCreating, hasAwaitingConfirmation } =
    useRealtimeAllTickets();

  // Use real-time selected ticket details
  const {
    ticket: realtimeTicket,
    isConfirming,
    markTicketFinished,
    isMarkingFinished,
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

    console.log('Creating Ticket: ', { createForm });
    try {
      await createNewTicket(employeeId, createForm);
      setCreateForm({ title: '', description: '' });
      setShowCreateForm(false);
      console.log('Ticket created successfully!');
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

  const handleMarkAsFinished = async () => {
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

  // Fix message ownership detection
  const isMyMessage = (senderId: string) => {
    if (!currentUser) return false;
    return senderId === currentUser.id;
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
    <div className="h-full bg-gray-100">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Ticket Management</h1>
          <p className="text-gray-600">Create, assign, and manage team tickets</p>

          <div className="mt-6">
            <Button
              variant={showCreateForm ? 'outline' : 'default'}
              size="lg"
              onClick={() => setShowCreateForm((prev) => !prev)}
              className={`${showCreateForm ? 'border-primary/30' : ''} w-46`}
            >
              {showCreateForm ? (
                <>
                  <X /> Cancel
                </>
              ) : (
                <>
                  <Plus /> Create New Ticket
                </>
              )}
            </Button>
          </div>
        </div>

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
                  className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <svg
                        className="mr-2 -ml-1 h-5 w-5 animate-spin text-white"
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
                      Creating Ticket...
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create Ticket
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="inline-flex items-center rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ticket Status Overview */}
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

            <div className="h-[560px] p-6">
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
                <div className="h-full space-y-4 overflow-y-auto">
                  {tickets.map((ticket) => {
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
                            {formatDateTime(ticket.createdAt)}
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
                                Assigned to: {ticket.employee.firstName} {ticket.employee.lastName}
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span>
                              By: {ticket.author.firstName} {ticket.author.lastName}
                            </span>
                          </div>
                        </div>
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
                      <span>Active Communication</span>
                    </div>
                  </div>
                ) : (
                  'Select a ticket to communicate'
                )}
              </h2>
              {selectedTicket && (
                <p className="mt-1 text-sm text-gray-600">
                  with {selectedTicket.employee.firstName} {selectedTicket.employee.lastName}
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
                    <h4 className="mb-1 text-sm font-medium text-gray-900">Task Description</h4>
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
                        Assigned to: {selectedTicket.employee.firstName}{' '}
                        {selectedTicket.employee.lastName}
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

                  {selectedTicket.status === 'AWAITING_CONFIRMATION' && (
                    <div className="mt-3 border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-amber-600">
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
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          <span>Employee marked this as finished</span>
                        </div>
                        <button
                          onClick={handleMarkAsFinished}
                          disabled={isConfirming}
                          className="inline-flex items-center rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isConfirming ? (
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
                              Confirming...
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
                              Confirm Finished
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CTO Direct Mark as Finished - Available for all non-finished tickets */}
                  {selectedTicket.status !== 'FINISHED' &&
                    selectedTicket.status !== 'AWAITING_CONFIRMATION' && (
                      <div className="mt-3 border-t border-gray-200 pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-blue-600">
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Mark as finished directly (CTO)</span>
                          </div>
                          <button
                            onClick={handleMarkAsFinished}
                            disabled={isMarkingFinished}
                            className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isMarkingFinished ? (
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
                          Start the conversation with your team member!
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
                                  isCurrentUser ? 'bg-blue-500' : 'bg-gray-500'
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
                                    ? 'rounded-br-md bg-blue-500 text-white'
                                    : 'rounded-bl-md border bg-white text-gray-800'
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <p
                                  className={`mt-1 text-xs ${
                                    isCurrentUser ? 'text-blue-100' : 'text-gray-500'
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
                      className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
                    Select a ticket to start communicating
                  </h3>
                  <p className="text-gray-500">
                    Choose a ticket from the list to chat with your team member
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
