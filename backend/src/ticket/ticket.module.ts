import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  providers: [TicketService],
  controllers: [TicketController],
  imports: [CaslModule],
})
export class TicketModule {}
