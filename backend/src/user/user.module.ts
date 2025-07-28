import { Module } from '@nestjs/common';
import { CaslModule } from 'src/casl/casl.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BucketModule } from './bucket/bucket.module';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [CaslModule, BucketModule],
  controllers: [UserController],
  providers: [UserService, FirebaseService],
})
export class UserModule {}
