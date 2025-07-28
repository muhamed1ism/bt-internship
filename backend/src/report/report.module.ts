import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [CaslModule],
  providers: [ReportService],
  controllers: [ReportController],
  exports: [ReportService]
})
export class ReportModule {}
