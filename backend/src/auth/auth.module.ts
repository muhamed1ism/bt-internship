import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FirebaseJwtStrategy } from './strategy';

@Module({
  providers: [AuthService, FirebaseService, FirebaseJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
