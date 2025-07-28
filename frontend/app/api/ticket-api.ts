import { getAuthHeaders } from '@app/lib/firebase';
import { BASE_URL, ENDPOINTS } from './api-config';
import { CreateMessageValue, CreateTicketValue } from '@app/schemas/ticketSchema';
import { Ticket, TicketMessage } from '@app/types/ticket';

export const getAllTicketsApi = async (): Promise<Ticket[]> => {
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

export const getMyTicketsApi = async (): Promise<Ticket[]> => {
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

export const getTicketMessagesApi = async (ticketId: string): Promise<TicketMessage[]> => {
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

export const createTicketApi = async (
  employeeId: string,
  ticketData: CreateTicketValue,
): Promise<Ticket> => {
  try {
    console.log('Create Ticket API: ', { employeeId, ticketData });
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.ticket.create(employeeId);

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

export const createMessageApi = async (
  ticketId: string,
  messageData: CreateMessageValue,
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

export const markTicketAwaitingConfirmationApi = async (ticketId: string): Promise<Ticket> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.ticket.markAwaitingConfirmation(ticketId);

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to mark ticket as awaiting confirmation');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to mark ticket as awaiting confirmation: ', error);
    throw error;
  }
};

export const markTicketFinishedApi = async (ticketId: string): Promise<Ticket> => {
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
