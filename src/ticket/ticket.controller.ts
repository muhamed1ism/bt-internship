import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateMessageDto, CreateTicketDto } from './dto';
import { FirebaseJwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../user/type/user.type';

@Controller('tickets')
@UseGuards(FirebaseJwtGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('all')
  async getAllTickets(@GetUser() user: User) {
    return this.ticketService.getAllTickets(user.id);
  }

  @Get('my')
  async getMyTickets(@GetUser() user: User) {
    return this.ticketService.getMyTickets(user.id);
  }

  @Post()
  async createTicket(
    @Body() createTicketDto: CreateTicketDto,
    @GetUser() user: User,
  ) {
    return this.ticketService.createTicket(user.id, createTicketDto);
  }

  @Get(':ticketId/messages')
  async getTicketMessages(
    @Param('ticketId') ticketId: string,
    @GetUser() user: User,
  ) {
    return this.ticketService.getTicketMessages(ticketId, user.id);
  }

  @Post(':ticketId/messages')
  async createMessage(
    @Param('ticketId') ticketId: string,
    @Body() createMessageDto: CreateMessageDto,
    @GetUser() user: User,
  ) {
    return this.ticketService.createMessage(
      ticketId,
      user.id,
      createMessageDto,
    );
  }

  @Post(':ticketId/mark-finished')
  async markAsFinished(
    @Param('ticketId') ticketId: string,
    @GetUser() user: User,
  ) {
    return this.ticketService.markAsFinished(ticketId, user.id);
  }

  @Post(':ticketId/confirm-finished')
  async confirmFinished(
    @Param('ticketId') ticketId: string,
    @GetUser() user: User,
  ) {
    return this.ticketService.confirmFinished(ticketId, user.id);
  }

  @Post(':ticketId/mark-finished-by-cto')
  async markAsFinishedByCTO(
    @Param('ticketId') ticketId: string,
    @GetUser() user: User,
  ) {
    return this.ticketService.markAsFinishedByCTO(ticketId, user.id);
  }
}
