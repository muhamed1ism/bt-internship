import { Controller, Put, Param, UseGuards } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { FirebaseJwtGuard } from '../auth/guard/firebase-jwt.guard';

@Controller('user/bucket')
@UseGuards(FirebaseJwtGuard)
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Put(':userId/promote/:categoryId')
  async promoteEmployee(
    @Param('userId') userId: string,
    @Param('categoryId') categoryId: string
  ) {
    return this.promotionService.promoteEmployee(userId, categoryId);
  }
} 