import z from 'zod';

const createTicketSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
});

const createMessageSchema = z.object({
  content: z.string(),
});

export type CreateTicketValue = z.infer<typeof createTicketSchema>;
export type CreateMessageValue = z.infer<typeof createMessageSchema>;

export const ticketSchema = {
  createTicket: createTicketSchema,
  createMessage: createMessageSchema,
};
