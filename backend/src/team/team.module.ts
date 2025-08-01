import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { MemberModule } from './member/member.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  providers: [TeamService],
  controllers: [TeamController],
  imports: [MemberModule, CaslModule],
})
export class TeamModule {}
