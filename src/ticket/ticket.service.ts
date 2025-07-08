import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTickets(userId: string) {
    // Check if user is CTO/admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const isCTO = user.role.name === 'admin' || user.role.name === 'team_lead';
    if (!isCTO) {
      throw new ForbiddenException('Only CTO/admin can view all tickets');
    }

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
        messages: {
          orderBy: { timestamp: 'desc' },
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
    return this.prisma.ticket.findMany({
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
        messages: {
          orderBy: { timestamp: 'desc' },
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

  async createTicket(userId: string, dto: CreateTicketDto) {
    // Check if user is CTO/admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const isCTO = user.role.name === 'admin' || user.role.name === 'team_lead';
    if (!isCTO) {
      throw new ForbiddenException('Only CTO/admin can create tickets');
    }

    // Verify the employee exists
    const employee = await this.prisma.user.findUnique({
      where: { id: dto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.ticket.create({
      data: {
        title: dto.title,
        description: dto.description,
        assignedBy: `${user.firstName} ${user.lastName}`,
        employeeId: dto.employeeId,
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

  async getTicketMessages(ticketId: string, userId: string) {
    // First, verify that the user has access to this ticket
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { employee: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check if user is either the assigned employee or has CTO privileges
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const isAssignedEmployee = ticket.employeeId === userId;
    const isCTO = user.role.name === 'admin' || user.role.name === 'team_lead';

    if (!isAssignedEmployee && !isCTO) {
      throw new ForbiddenException('You do not have access to this ticket');
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
      orderBy: { timestamp: 'asc' },
    });

    return messages;
  }

  async createMessage(ticketId: string, userId: string, dto: CreateMessageDto) {
    // First, verify that the user has access to this ticket
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { employee: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check if user is either the assigned employee or has CTO privileges
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const isAssignedEmployee = ticket.employeeId === userId;
    const isCTO = user.role.name === 'admin' || user.role.name === 'team_lead';

    if (!isAssignedEmployee && !isCTO) {
      throw new ForbiddenException('You do not have access to this ticket');
    }

    // Create the message
    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        sender: `${user.firstName} ${user.lastName}`,
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
}
