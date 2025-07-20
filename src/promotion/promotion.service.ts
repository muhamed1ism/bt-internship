import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionService {
  constructor(private prisma: PrismaService) {}

  async promoteEmployee(userId: string, categoryId: string) {
    // Get current user bucket assignment
    const userBucket = await this.prisma.userBucket.findFirst({
      where: {
        userId,
        bucket: {
          categoryId
        }
      },
      include: {
        bucket: true
      }
    });

    if (!userBucket) {
      throw new NotFoundException('User not assigned to this bucket category');
    }

    const currentLevel = userBucket.bucket.level;
    
    // Find next level in same category
    const nextLevel = await this.prisma.bucketLevel.findFirst({
      where: {
        categoryId,
        level: currentLevel + 1
      }
    });

    if (!nextLevel) {
      throw new BadRequestException('No higher level available in this category');
    }

    // Update user bucket assignment to next level
    await this.prisma.userBucket.update({
      where: {
        userId_bucketLevelId: {
          userId,
          bucketLevelId: userBucket.bucketLevelId
        }
      },
      data: {
        bucketLevelId: nextLevel.id
      }
    });

    return {
      success: true,
      message: 'User Bucket Level promoted successfully',
      previousLevel: currentLevel,
      newLevel: nextLevel.level
    };
  }
} 