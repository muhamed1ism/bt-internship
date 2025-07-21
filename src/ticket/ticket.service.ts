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

  async getAnalyticsOverview() {
    // Get ticket counts by status and resolution rate
    const [total, pending, ongoing, awaitingConfirmation, finished] = await Promise.all([
      this.prisma.ticket.count(),
      this.prisma.ticket.count({ where: { status: 'PENDING' } }),
      this.prisma.ticket.count({ where: { status: 'ONGOING' } }),
      this.prisma.ticket.count({ where: { status: 'AWAITING_CONFIRMATION' } }),
      this.prisma.ticket.count({ where: { status: 'FINISHED' } }),
    ]);
    const resolutionRate = total > 0 ? (finished / total) * 100 : 0;
    return {
      total,
      pending,
      ongoing,
      awaitingConfirmation,
      finished,
      resolutionRate: Math.round(resolutionRate * 10) / 10
    };
  }

  async getAnalyticsTrends(params: any) {
    // period: daily, weekly, monthly; limit: number of periods
    const period = params.period || 'weekly';
    const limit = parseInt(params.limit, 10) || 12;
    // Get the earliest ticket date
    const firstTicket = await this.prisma.ticket.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!firstTicket) return [];
    const now = new Date();
    let startDates: Date[] = [];
    let format: (d: Date) => string;
    if (period === 'daily') {
      for (let i = limit - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        startDates.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
      }
      format = d => d.toISOString().slice(0, 10);
    } else if (period === 'monthly') {
      for (let i = limit - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        startDates.push(new Date(d.getFullYear(), d.getMonth(), 1));
      }
      format = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    } else { // weekly
      for (let i = limit - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i * 7);
        // Set to Monday
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
        startDates.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
      }
      format = d => {
        const monday = new Date(d);
        return monday.toISOString().slice(0, 10);
      };
    }
    // For each period, count tickets created in that period by status
    const results: any[] = [];
    for (let i = 0; i < startDates.length; i++) {
      const start = startDates[i];
      const end = new Date(i + 1 < startDates.length ? startDates[i + 1] : now);
      const counts = await this.prisma.ticket.groupBy({
        by: ['status'],
        where: {
          createdAt: {
            gte: start,
            lt: end
          }
        },
        _count: { _all: true }
      });
      for (const c of counts) {
        results.push({
          date: format(start),
          count: c._count._all,
          status: c.status
        });
      }
    }
    return results;
  }

  async getAnalyticsPerformance() {
    // Get all finished tickets
    const finishedTickets = await this.prisma.ticket.findMany({
      where: { status: 'FINISHED' },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });
    // Avg resolution time: finished - createdAt
    let totalResolutionMs = 0;
    let totalResponseMs = 0;
    let escalationCount = 0;
    let satisfactionSum = 0;
    let satisfactionCount = 0;
    for (const t of finishedTickets) {
      totalResolutionMs += t.updatedAt.getTime() - t.createdAt.getTime();
      // Avg response time: first message - createdAt
      if (t.messages.length > 0) {
        totalResponseMs += t.messages[0].createdAt.getTime() - t.createdAt.getTime();
      }
      // Escalation: if authorId !== employeeId
      if (t.authorId !== t.employeeId) escalationCount++;
      // Satisfaction: placeholder (no field)
    }
    const avgResolutionTime = finishedTickets.length > 0 ? totalResolutionMs / finishedTickets.length : 0;
    const avgResponseTime = finishedTickets.length > 0 ? totalResponseMs / finishedTickets.length : 0;
    // Satisfaction: not implemented (no field)
    // Escalation rate: percent of finished tickets where authorId !== employeeId
    const escalationRate = finishedTickets.length > 0 ? (escalationCount / finishedTickets.length) * 100 : 0;
    // Format durations
    function formatDuration(ms: number) {
      if (ms === 0) return 'N/A';
      const days = ms / (1000 * 60 * 60 * 24);
      if (days >= 1) return `${days.toFixed(1)} days`;
      const hours = ms / (1000 * 60 * 60);
      if (hours >= 1) return `${hours.toFixed(1)} hours`;
      const minutes = ms / (1000 * 60);
      return `${minutes.toFixed(1)} minutes`;
    }
    return {
      avgResolutionTime: formatDuration(avgResolutionTime),
      avgResponseTime: formatDuration(avgResponseTime),
      escalationRate: Math.round(escalationRate * 10) / 10,
      satisfactionScore: 0 // Not implemented
    };
  }

  async getRecentTickets(params: any) {
    const limit = parseInt(params.limit, 10) || 10;
    const tickets = await this.prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        employee: { select: { firstName: true, lastName: true } }
      }
    });
    return tickets.map(t => ({
      id: t.id,
      title: t.title,
      status: t.status,
      employee: t.employee,
      createdAt: t.createdAt
    }));
  }

  async getEmployeePerformance(params: any) {
    // period: monthly, weekly, etc. (default: monthly)
    const period = params.period || 'monthly';
    const now = new Date();
    let periodStart: Date;
    if (period === 'weekly') {
      periodStart = new Date(now);
      periodStart.setDate(now.getDate() - 7);
    } else {
      // monthly
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    // Get all finished tickets in period
    const tickets = await this.prisma.ticket.findMany({
      where: {
        status: 'FINISHED',
        updatedAt: { gte: periodStart }
      },
      include: { employee: true, messages: { orderBy: { createdAt: 'asc' } } }
    });
    // Group by employee
    const perf: Record<string, { employeeId: string, employeeName: string, ticketsResolved: number, totalResolutionMs: number }> = {};
    for (const t of tickets) {
      const id = t.employee.id;
      if (!perf[id]) {
        perf[id] = {
          employeeId: id,
          employeeName: `${t.employee.firstName} ${t.employee.lastName}`,
          ticketsResolved: 0,
          totalResolutionMs: 0
        };
      }
      perf[id].ticketsResolved++;
      perf[id].totalResolutionMs += t.updatedAt.getTime() - t.createdAt.getTime();
    }
    // Format output
    return Object.values(perf).map(e => ({
      employeeId: e.employeeId,
      employeeName: e.employeeName,
      ticketsResolved: e.ticketsResolved,
      avgResolutionTime: e.ticketsResolved > 0 ? `${(e.totalResolutionMs / e.ticketsResolved / (1000 * 60 * 60 * 24)).toFixed(1)} days` : 'N/A',
      satisfactionScore: 0 // Not implemented
    })).sort((a, b) => b.ticketsResolved - a.ticketsResolved);
  }
}
