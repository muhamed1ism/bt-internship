import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ReportModule } from '../report/report.module';

@Module({
  imports: [PrismaModule, ReportModule],
  providers: [EvaluationService],
  controllers: [EvaluationController],
  exports: [EvaluationService]
})
export class EvaluationModule {} 