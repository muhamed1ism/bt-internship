import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [CaslModule],
  providers: [BucketService],
  controllers: [BucketController],
})
export class BucketModule {}
