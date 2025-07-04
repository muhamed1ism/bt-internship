import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    const categories = await this.prisma.bucketCategory.findMany({
      include: {
        bucketLevels: true,
      },
    });

    if (!categories) {
      throw new NotFoundException('No categories found');
    }

    return categories;
  }

  async createCategory(dto: CreateCategoryDto) {
    try {
      await this.prisma.bucketCategory.create({
        data: {
          name: dto.name,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error while creating Bucket Category: ', error);
    }
  }

  async updateCategory(categoryId: string, dto: UpdateCategoryDto) {
    try {
      await this.prisma.bucketCategory.update({
        where: { id: categoryId },
        data: {
          name: dto.name,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error while updating Bucket Category: ', error);
    }
  }

  async deleteCategory(categoryId: string) {
    try {
      await this.prisma.bucketLevel.deleteMany({
        where: { categoryId },
      });

      await this.prisma.bucketCategory.delete({
        where: { id: categoryId },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error while deleting Bucket Category: ', error);
    }
  }
}
