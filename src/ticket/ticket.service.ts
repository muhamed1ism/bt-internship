import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { User } from 'src/user/type/user.type';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTickets() {
    return this.prisma.ticket.findMany({
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get latest message for preview
          include: {
            senderUser: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyTickets(userId: string) {
    // Get tickets assigned to the current user
    const tickets = await this.prisma.ticket.findMany({
      where: { employeeId: userId },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get latest message for preview
          include: {
            senderUser: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!tickets) throw new NotFoundException('Tickets not found');

    return tickets;
  }

  async getTicketMessages(ticketId: string, userId: string) {
    // First, verify that the user has access to this ticket
    const ticket = await this.prisma.ticket.findUnique({
      where: {
        id: ticketId,
        OR: [{ employeeId: userId }, { authorId: userId }],
      },
      include: { employee: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Fetch messages for this ticket
    const messages = await this.prisma.message.findMany({
      where: { ticketId },
      include: {
        senderUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }

  async createTicket(employeeId: string, user: User, dto: CreateTicketDto) {
    // Verify the employee exists
    const employee = await this.prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.ticket.create({
      data: {
        title: dto.title,
        description: dto.description,
        authorId: user.id,
        employeeId: employeeId,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async createMessage(ticketId: string, userId: string, dto: CreateMessageDto) {
    // First, verify that the user has access to this ticket
    const ticket = await this.prisma.ticket.findUnique({
      where: {
        id: ticketId,
        OR: [{ authorId: userId }, { employeeId: userId }],
      },
      include: { employee: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Prevent actions on finished tickets
    if (ticket.status === 'FINISHED') {
      throw new ForbiddenException('Cannot add messages to finished tickets');
    }

    // If CTO sends a message and ticket is in AWAITING_CONFIRMATION, reset to ONGOING
    if (ticket.status === 'AWAITING_CONFIRMATION') {
      await this.prisma.ticket.update({
        where: { id: ticketId },
        data: { status: 'ONGOING' },
      });
    }

    // Create the message
    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        ticketId,
        senderId: userId,
      },
      include: {
        senderUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return message;
  }

  async markAsAwaitingConfirmation(ticketId: string, userId: string) {
    // First, verify that the user has access to this ticket
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId, employeeId: userId },
      include: { employee: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Prevent actions on finished tickets
    if (ticket.status === 'FINISHED') {
      throw new ForbiddenException('Cannot modify finished tickets');
    }

    // Update ticket status to AWAITING_CONFIRMATION
    const updatedTicket = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'AWAITING_CONFIRMATION' },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedTicket;
  }

  async markAsFinished(ticketId: string) {
    // First, verify that the user has access to this ticket
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { employee: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Prevent actions on finished tickets
    if (ticket.status === 'FINISHED') {
      throw new ForbiddenException('Ticket is already finished');
    }

    // Update ticket status directly to FINISHED
    const updatedTicket = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'FINISHED' },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedTicket;
  }
}
