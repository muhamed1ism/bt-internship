import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  providers: [LevelService],
  controllers: [LevelController],
  imports: [CaslModule],
})
export class LevelModule {}
