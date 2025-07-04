import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLevelDto, UpdateLevelDto } from './dto';

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategoryLevels(categoryId: string) {
    const levels = await this.prisma.bucketLevel.findMany({
      where: { categoryId },
      include: { category: true },
      orderBy: { level: 'asc' },
    });

    return levels;
  }

  async getMyCategoryLevel(categoryId: string) {
    const level = await this.prisma.userBucket.findFirst({
      where: {
        bucket: {
          categoryId,
        },
      },
      include: {
        bucket: {
          select: {
            id: true,
            categoryId: true,
            level: true,
            category: true,
          },
        },
      },
    });

    if (!level) throw new NotFoundException('User level not found');

    return level;
  }

  async createLevel(categoryId: string, dto: CreateLevelDto) {
    try {
      const existingLevel = await this.prisma.bucketLevel.findUnique({
        where: {
          level_categoryId: {
            categoryId,
            level: dto.level,
          },
        },
      });
      const allLevels = await this.getAllCategoryLevels(categoryId);

      if (existingLevel) {
        const levelsToShift = await this.prisma.bucketLevel.findMany({
          where: {
            categoryId,
            level: {
              gte: dto.level,
            },
          },
          orderBy: { level: 'desc' },
        });

        for (const lvl of levelsToShift) {
          await this.prisma.bucketLevel.update({
            where: {
              level_categoryId: {
                categoryId,
                level: lvl.level,
              },
            },
            data: {
              level: lvl.level + 1,
            },
          });
        }
      } else if (dto.level > allLevels.length) {
        dto.level = allLevels.length + 1;
      }

      return this.prisma.bucketLevel.create({
        data: {
          categoryId,
          level: dto.level,
          expectations: dto.expectations,
          knowledge: dto.knowledge,
          tools: dto.tools,
          skills: dto.skills,
          toAdvance: dto.toAdvance,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error creating bucket level: ', error);
    }
  }

  async updateLevel(levelId: string, dto: UpdateLevelDto) {
    try {
      await this.prisma.bucketLevel.update({
        where: { id: levelId },
        data: {
          level: dto.level,
          expectations: dto.expectations,
          knowledge: dto.knowledge,
          tools: dto.tools,
          skills: dto.skills,
          toAdvance: dto.toAdvance,
          categoryId: dto.categoryId,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error creating bucket level: ', error);
    }
  }

  async deleteLevel(levelId: string) {
    try {
      const bucketLevel = await this.prisma.bucketLevel.findUnique({
        where: { id: levelId },
        select: { level: true, categoryId: true },
      });

      if (!bucketLevel) {
        throw new NotFoundException('Level not found');
      }

      const allBucketLevels = await this.getAllCategoryLevels(
        bucketLevel.categoryId,
      );

      await this.prisma.bucketLevel.delete({
        where: { id: levelId },
      });

      if (bucketLevel?.level < allBucketLevels.length) {
        const updates: Promise<any>[] = [];
        for (
          let curr = bucketLevel?.level + 1;
          curr <= allBucketLevels.length;
          curr++
        ) {
          updates.push(
            this.prisma.bucketLevel.update({
              where: {
                level_categoryId: {
                  categoryId: bucketLevel.categoryId,
                  level: curr,
                },
              },
              data: { level: curr - 1 },
            }),
          );
        }
        await Promise.all(updates);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting bucket level: ', error);
    }
  }
}
