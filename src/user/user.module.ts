import { Module } from '@nestjs/common';
import { CaslModule } from 'src/casl/casl.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BucketModule } from './bucket/bucket.module';

@Module({
  imports: [CaslModule, BucketModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
