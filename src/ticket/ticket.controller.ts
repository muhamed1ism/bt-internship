import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
  Put,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateMessageDto, CreateTicketDto } from './dto';
import { FirebaseJwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../user/type/user.type';
import { AbilitiesGuard } from 'src/casl/abilities/guard';
import { CheckAbilities, RequestAbility } from 'src/casl/abilities/decorator';
import {
  Action,
  AppAbility,
  Subject,
} from 'src/casl/ability-factory/casl-ability.factory';

@Controller('tickets')
@UseGuards(FirebaseJwtGuard, AbilitiesGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('all')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.Ticket),
  ) // CTO and ADMIN only
  async getAllTickets(@RequestAbility() ability: AppAbility) {
    if (ability.cannot(Action.Read, Subject.Ticket)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.ticketService.getAllTickets();
  }

  @Get('my')
  async getMyTickets(@GetUser() user: User) {
    return this.ticketService.getMyTickets(user.id);
  }

  @Get(':ticketId/messages')
  async getTicketMessages(
    @Param('ticketId') ticketId: string,
    @GetUser() user: User,
  ) {
    return this.ticketService.getTicketMessages(ticketId, user.id);
  }

  @Post(':employeeId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Create, Subject.Ticket),
  )
  async createTicket(
    @Param('employeeId') employeeId: string,
    @Body() createTicketDto: CreateTicketDto,
    @GetUser() user: User,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Create, Subject.Ticket)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.ticketService.createTicket(employeeId, user, createTicketDto);
  }

  @Post(':ticketId/messages')
  async createMessage(
    @Param('ticketId') ticketId: string,
    @Body() messageData: CreateMessageDto,
    @GetUser() user: User,
  ) {
    return this.ticketService.createMessage(ticketId, user.id, messageData);
  }

  @Put(':ticketId/mark-awaiting-confirmation')
  async markAsAwaitingConfirmation(
    @Param('ticketId') ticketId: string,
    @GetUser() user: User,
  ) {
    return this.ticketService.markAsAwaitingConfirmation(ticketId, user.id);
  }

  @Put(':ticketId/mark-finished')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.Ticket),
  ) // CTO and ADMIN only
  async confirmFinished(
    @Param('ticketId') ticketId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Update, Subject.Ticket)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.ticketService.markAsFinished(ticketId);
  }
}
