import { useState, useEffect } from 'react';
import { getAllTickets, createTicket, Ticket } from '../api/ticket-api';
import { getAllUsersApi } from '../api/user-api';
import { useChat } from '../hooks/useChat';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  roleId: string;
}

interface CreateTicketForm {
  title: string;
  description: string;
  employeeId: string;
}

export const CtoTicketTest = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateTicketForm>({
    title: '',
    description: '',
    employeeId: '',
  });

  const { messages, sendMessage, isLoading: chatLoading } = useChat(selectedTicket?.id || null);

  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadTickets();
    loadUsers();
  }, []);

  const loadTickets = async () => {
    try {
      const ticketData = await getAllTickets();
      setTickets(ticketData);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    setIsCreating(true);

    try {
      const newTicket = await createTicket(createForm);
      setTickets([newTicket, ...tickets]);
      setCreateForm({ title: '', description: '', employeeId: '' });
      setShowCreateForm(false);
      console.log('Ticket created successfully!');
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setIsCreating(false);
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">CTO Ticket Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {showCreateForm ? 'Cancel' : 'Create New Ticket'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Create New Ticket</h2>
          <form onSubmit={handleCreateTicket}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Assign to Employee
              </label>
              <select
                value={createForm.employeeId}
                onChange={(e) => setCreateForm({ ...createForm, employeeId: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isCreating}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Ticket'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tickets List */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">All Tickets ({tickets.length})</h2>
          {tickets.length === 0 ? (
            <p className="text-gray-500">No tickets found. Create your first ticket!</p>
          ) : (
            <div className="max-h-96 space-y-4 overflow-y-auto">
              {tickets.map((ticket) => (
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
                    <span className="text-xs text-gray-500">
                      {formatDateTime(ticket.createdAt)}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">
                    {ticket.description.substring(0, 100)}
                    {ticket.description.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Assigned to: {ticket.employee.firstName} {ticket.employee.lastName}
                    </span>
                    <span className="text-xs text-gray-400">By: {ticket.assignedBy}</span>
                  </div>
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
                          message.sender.includes('CTO') ? 'ml-8 bg-blue-100' : 'mr-8 bg-white'
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
