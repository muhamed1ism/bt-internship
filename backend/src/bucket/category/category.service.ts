import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    const categories = await this.prisma.bucketCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            bucketLevels: true,
          },
        },
        bucketLevels: {
          orderBy: {
            level: 'desc',
          },
        },
      },
    });

    if (!categories) {
      throw new NotFoundException('No categories found');
    }

    return categories;
  }

  async getCategoryById(categoryId: string) {
    const category = await this.prisma.bucketCategory.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        bucketLevels: {
          orderBy: {
            level: 'desc',
          },
        },
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async createCategory(dto: CreateCategoryDto) {
    const category = await this.prisma.bucketCategory.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (category)
      throw new ConflictException(
        'Bucket category with this name already exists',
      );

    return this.prisma.bucketCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async updateCategory(categoryId: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.bucketCategory.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) throw new NotFoundException('Bucket category not found');

    return this.prisma.bucketCategory.update({
      where: { id: categoryId },
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async deleteCategory(categoryId: string) {
    try {
      await this.prisma.bucketLevel.deleteMany({
        where: { categoryId },
      });

      return this.prisma.bucketCategory.delete({
        where: { id: categoryId },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error while deleting Bucket Category: ', error);
    }
  }
}
