import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PromotionService],
  controllers: [PromotionController],
  exports: [PromotionService]
})
export class PromotionModule {} 