import { getAuthHeaders } from '@app/lib/firebase';
import { BASE_URL, ENDPOINTS } from './api-config';

export interface TicketMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  ticketId: string;
  senderId: string;
  senderUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateMessageRequest {
  content: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  employeeId: string;
}

export type TicketStatus = 'PENDING' | 'ONGOING' | 'AWAITING_CONFIRMATION' | 'FINISHED';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignedAt: string;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
  employeeId: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  messages?: TicketMessage[];
}

export const getTicketMessages = async (ticketId: string): Promise<TicketMessage[]> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.ticket.getMessages(ticketId);

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch messages');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch messages: ', error);
    throw error;
  }
};

export const createMessage = async (
  ticketId: string,
  messageData: CreateMessageRequest,
): Promise<TicketMessage> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.ticket.createMessage(ticketId);

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(messageData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create message');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create message: ', error);
    throw error;
  }
};

export const getAllTickets = async (): Promise<Ticket[]> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.ticket.getAll;

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch tickets');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch tickets: ', error);
    throw error;
  }
};

export const getMyTickets = async (): Promise<Ticket[]> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.ticket.getMy;

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch my tickets');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch my tickets: ', error);
    throw error;
  }
};

export const createTicket = async (ticketData: CreateTicketRequest): Promise<Ticket> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.ticket.create;

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(ticketData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create ticket');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create ticket: ', error);
    throw error;
  }
};

export const markTicketAsFinished = async (ticketId: string): Promise<Ticket> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.ticket.markFinished(ticketId);

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to mark ticket as finished');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to mark ticket as finished: ', error);
    throw error;
  }
};

export const confirmTicketFinished = async (ticketId: string): Promise<Ticket> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.ticket.confirmFinished(ticketId);

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to confirm ticket as finished');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to confirm ticket as finished: ', error);
    throw error;
  }
};

export const markTicketFinishedByCTO = async (ticketId: string): Promise<Ticket> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.ticket.markFinishedByCTO(ticketId);

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to mark ticket as finished by CTO');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to mark ticket as finished by CTO: ', error);
    throw error;
  }
};
