import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { POLLING_INTERVALS, CACHE_CONFIG } from '@app/constants/ticket';
import type { Ticket } from '@app/types/ticket';
import {
  createTicketApi,
  getAllTicketsApi,
  getMyTicketsApi,
  markTicketAwaitingConfirmationApi,
  markTicketFinishedApi,
} from '@app/api/ticket-api';
import { CreateTicketValue } from '@app/schemas/ticketSchema';

/**
 * React Query keys for ticket functionality
 */
export const TICKET_QUERY_KEYS = {
  all: ['tickets'] as const,
  allTickets: () => [...TICKET_QUERY_KEYS.all, 'all'] as const,
  myTickets: () => [...TICKET_QUERY_KEYS.all, 'my'] as const,
  ticket: (id: string) => [...TICKET_QUERY_KEYS.all, 'detail', id] as const,
};

/**
 * Hook for real-time ticket management (CTO view)
 */
export const useRealtimeAllTickets = (
  options: {
    pollingInterval?: number;
    enabled?: boolean;
  } = {},
) => {
  const { pollingInterval = POLLING_INTERVALS.TICKET_LIST, enabled = true } = options;
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: TICKET_QUERY_KEYS.allTickets(),
    queryFn: getAllTicketsApi,
    enabled,
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: true,
    staleTime: CACHE_CONFIG.STALE_TIME.TICKET_LIST,
    gcTime: CACHE_CONFIG.GC_TIME.DEFAULT,
  });

  // Sort tickets to prioritize AWAITING_CONFIRMATION first
  const sortedTickets = tickets.sort((a, b) => {
    // Priority order: AWAITING_CONFIRMATION > ONGOING > PENDING > FINISHED
    const statusPriority = {
      AWAITING_CONFIRMATION: 1,
      ONGOING: 2,
      PENDING: 3,
      FINISHED: 4,
    };

    const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 5;
    const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 5;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // If same priority, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Mutations
  const createTicket = useMutation({
    mutationFn: ({
      employeeId,
      ticketData,
    }: {
      employeeId: string;
      ticketData: CreateTicketValue;
    }) => createTicketApi(employeeId, ticketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.allTickets() });
    },
  });

  const markFinished = useMutation({
    mutationFn: markTicketFinishedApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.allTickets() });
    },
  });

  // Helper methods
  const createNewTicket = async (employeeId: string, ticketData: CreateTicketValue) => {
    return createTicket.mutateAsync({ employeeId, ticketData });
  };

  const markTicketFinishedDirectly = async (ticketId: string) => {
    return markFinished.mutateAsync(ticketId);
  };

  const refreshTickets = () => {
    queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.allTickets() });
  };

  // Get counts by status
  const ticketCounts = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === 'PENDING').length,
    ongoing: tickets.filter((t) => t.status === 'ONGOING').length,
    awaitingConfirmation: tickets.filter((t) => t.status === 'AWAITING_CONFIRMATION').length,
    finished: tickets.filter((t) => t.status === 'FINISHED').length,
  };

  return {
    // Data
    tickets: sortedTickets,
    ticketCounts,
    isLoading,
    error,

    // Actions
    createNewTicket,
    markTicketFinishedDirectly,
    refreshTickets,
    refetch,

    // Mutation states
    isCreating: createTicket.isPending,
    isConfirming: markFinished.isPending,
    isMarkingFinished: markFinished.isPending,

    // Computed
    hasAwaitingConfirmation: ticketCounts.awaitingConfirmation > 0,
    awaitingConfirmationTickets: tickets.filter((t) => t.status === 'AWAITING_CONFIRMATION'),
  };
};

/**
 * Hook for real-time ticket management (Employee view)
 */
export const useRealtimeMyTickets = (
  options: {
    pollingInterval?: number;
    enabled?: boolean;
  } = {},
) => {
  const { pollingInterval = POLLING_INTERVALS.TICKET_LIST, enabled = true } = options;
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: TICKET_QUERY_KEYS.myTickets(),
    queryFn: getMyTicketsApi,
    enabled,
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: true,
    staleTime: CACHE_CONFIG.STALE_TIME.TICKET_LIST,
    gcTime: CACHE_CONFIG.GC_TIME.DEFAULT,
  });

  // Sort tickets by status and date
  const sortedTickets = tickets.sort((a, b) => {
    // Priority: ONGOING > AWAITING_CONFIRMATION > PENDING > FINISHED
    const statusPriority = {
      ONGOING: 1,
      AWAITING_CONFIRMATION: 2,
      PENDING: 3,
      FINISHED: 4,
    };

    const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 5;
    const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 5;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const markAsFinishedMutation = useMutation({
    mutationFn: markTicketFinishedApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.myTickets() });
    },
  });

  const markAsFinished = async (ticketId: string) => {
    return markAsFinishedMutation.mutateAsync(ticketId);
  };

  const refreshTickets = () => {
    queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.myTickets() });
  };

  return {
    // Data
    tickets: sortedTickets,
    isLoading,
    error,

    // Actions
    markAsFinished,
    refreshTickets,
    refetch,

    // Mutation states
    isMarkingFinished: markAsFinishedMutation.isPending,

    // Computed
    activeTickets: tickets.filter((t) => t.status !== 'FINISHED'),
    finishedTickets: tickets.filter((t) => t.status === 'FINISHED'),
  };
};

/**
 * Hook for real-time individual ticket details
 */
export const useRealtimeTicket = (
  ticketId: string | null,
  options: {
    pollingInterval?: number;
    enabled?: boolean;
  } = {},
) => {
  const { pollingInterval = POLLING_INTERVALS.TICKET_DETAIL, enabled = true } = options;
  const queryClient = useQueryClient();

  const {
    data: ticket,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: TICKET_QUERY_KEYS.ticket(ticketId || ''),
    queryFn: async () => {
      if (!ticketId) return null;

      // Try to get from cache first (from all tickets or my tickets)
      const allTicketsData = queryClient.getQueryData(TICKET_QUERY_KEYS.allTickets());
      const myTicketsData = queryClient.getQueryData(TICKET_QUERY_KEYS.myTickets());

      // Check all tickets cache
      if (allTicketsData && Array.isArray(allTicketsData)) {
        const cachedTicket = (allTicketsData as Ticket[]).find((t) => t.id === ticketId);
        if (cachedTicket) return cachedTicket;
      }

      // Check my tickets cache
      if (myTicketsData && Array.isArray(myTicketsData)) {
        const cachedTicket = (myTicketsData as Ticket[]).find((t) => t.id === ticketId);
        if (cachedTicket) return cachedTicket;
      }

      // If not in cache, we'll rely on the list queries to provide the data
      return null;
    },
    enabled: enabled && !!ticketId,
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: true,
    staleTime: CACHE_CONFIG.STALE_TIME.TICKET_DETAIL,
    gcTime: CACHE_CONFIG.GC_TIME.SHORT,
  });

  const markFinishedMutation = useMutation({
    mutationFn: markTicketFinishedApi,
    onMutate: async (ticketId) => {
      await queryClient.cancelQueries({ queryKey: TICKET_QUERY_KEYS.ticket(ticketId) });
      const previousTicket = queryClient.getQueryData(TICKET_QUERY_KEYS.ticket(ticketId));

      if (previousTicket) {
        queryClient.setQueryData(TICKET_QUERY_KEYS.ticket(ticketId), {
          ...previousTicket,
          status: 'FINISHED',
        });
      }

      return { previousTicket };
    },
    onError: (_err, ticketId, context) => {
      if (context?.previousTicket) {
        queryClient.setQueryData(TICKET_QUERY_KEYS.ticket(ticketId), context.previousTicket);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.allTickets() });
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.myTickets() });
    },
  });

  const markAsAwaitingConfirmationMutation = useMutation({
    mutationFn: markTicketAwaitingConfirmationApi,
    onMutate: async (ticketId) => {
      await queryClient.cancelQueries({ queryKey: TICKET_QUERY_KEYS.ticket(ticketId) });
      const previousTicket = queryClient.getQueryData(TICKET_QUERY_KEYS.ticket(ticketId));

      if (previousTicket) {
        queryClient.setQueryData(TICKET_QUERY_KEYS.ticket(ticketId), {
          ...previousTicket,
          status: 'AWAITING_CONFIRMATION',
        });
      }

      return { previousTicket };
    },
    onError: (_err, ticketId, context) => {
      if (context?.previousTicket) {
        queryClient.setQueryData(TICKET_QUERY_KEYS.ticket(ticketId), context.previousTicket);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.allTickets() });
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.myTickets() });
    },
  });

  // Actions
  const markTicketFinished = async (ticketId: string) => {
    return markFinishedMutation.mutateAsync(ticketId);
  };

  const markAsAwaitingConfirmation = async (ticketId: string) => {
    return markAsAwaitingConfirmationMutation.mutateAsync(ticketId);
  };

  const refreshTicket = () => {
    if (ticketId) {
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.ticket(ticketId) });
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.allTickets() });
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.myTickets() });
    }
  };

  return {
    // Data
    ticket,
    isLoading,
    error,

    // Actions
    markTicketFinished,
    markAsAwaitingConfirmation,
    refreshTicket,
    refetch,

    // Mutation states
    isConfirming: markFinishedMutation.isPending,
    isMarkingFinished: markFinishedMutation.isPending,
    isMarkingAsFinished: markAsAwaitingConfirmationMutation.isPending,

    // Status helpers
    isAwaitingConfirmation: ticket?.status === 'AWAITING_CONFIRMATION',
    isFinished: ticket?.status === 'FINISHED',
    canConfirm: ticket?.status === 'AWAITING_CONFIRMATION',
    canMarkFinished: ticket?.status !== 'FINISHED',
  };
};
