import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from 'config/service/appConfig.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CaslModule } from './casl/casl.module';
import { BucketModule } from './bucket/bucket.module';
import { TeamModule } from './team/team.module';
import { ReportModule } from './report/report.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    FirebaseModule,
    UserModule,
    CaslModule,
    BucketModule,
    TeamModule,
    ReportModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule {}
