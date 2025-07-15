import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { LevelModule } from './level/level.module';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  providers: [BucketService],
  controllers: [BucketController],
  imports: [CategoryModule, LevelModule, CaslModule],
})
export class BucketModule {}
