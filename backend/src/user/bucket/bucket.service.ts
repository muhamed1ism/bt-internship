import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignBucketsDto } from './dto/assign-buckets.dto';

@Injectable()
export class BucketService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserBuckets(userId: string) {
    const userBuckets = this.prisma.userBucket.findMany({
      where: { userId },
      include: {
        bucket: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        bucket: {
          level: 'desc',
        },
      },
    });

    if (!userBuckets) throw new NotFoundException('User buckets not found');

    return userBuckets;
  }

  async assignBucketToUser(userId: string, bucketLevelId: string) {
    const bucketLevel = await this.prisma.bucketLevel.findFirst({
      where: {
        id: bucketLevelId,
      },
      select: {
        categoryId: true,
      },
    });

    if (!bucketLevel) throw new NotFoundException('Bucket level not found');

    const alreadyAssignedBucket = await this.prisma.userBucket.findFirst({
      where: {
        AND: [{ userId }, { bucket: { categoryId: bucketLevel.categoryId } }],
      },
    });

    if (alreadyAssignedBucket) {
      throw new ForbiddenException('Bucket already assigned');
    }

    await this.prisma.userBucket.create({
      data: {
        userId,
        bucketLevelId,
      },
    });
  }

  async assignBucketsToUser(userId: string, dto: AssignBucketsDto) {
    const results: any = [];

    for (const bucketLevelId of dto.bucketLevelIds) {
      results.push(await this.assignBucketToUser(userId, bucketLevelId));
    }

    return Promise.all(results);
  }

  async promoteUserBucketLevel(userId: string, categoryId: string) {
    const userBucket = await this.prisma.userBucket.findFirst({
      where: {
        userId,
        bucket: {
          categoryId,
        },
      },
      include: {
        bucket: true,
      },
    });

    if (!userBucket) throw new NotFoundException('User bucket not found');

    const nextLevel = await this.prisma.bucketLevel.findFirst({
      where: {
        categoryId: userBucket.bucket.categoryId,
        level: userBucket.bucket.level + 1,
      },
    });

    if (!nextLevel) throw new NotFoundException('Next level not found');

    await this.prisma.userBucket.update({
      where: {
        userId_bucketLevelId: {
          userId,
          bucketLevelId: userBucket.bucketLevelId,
        },
      },
      data: { bucketLevelId: nextLevel.id },
    });

    return { message: 'User Bucket Level promoted succesfuly' };
  }

  async unassignUserBucket(userId: string, bucketLevelId: string) {
    const userBucketLevel = await this.prisma.userBucket.findUnique({
      where: {
        userId_bucketLevelId: {
          userId,
          bucketLevelId,
        },
      },
    });

    if (!userBucketLevel)
      throw new NotFoundException('Bucket level is not assigned to user');

    return this.prisma.userBucket.delete({
      where: {
        userId_bucketLevelId: {
          userId,
          bucketLevelId,
        },
      },
    });
  }
}
