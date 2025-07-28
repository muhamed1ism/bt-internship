import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
