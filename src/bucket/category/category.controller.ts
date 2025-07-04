import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CategoryService } from './category.service';

@Controller('bucket/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('all')
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Post('create')
  createCategory(@Body() categoryData: CreateCategoryDto) {
    return this.categoryService.createCategory(categoryData);
  }

  @Put('update/:categoryId')
  updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() categoryData: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(categoryId, categoryData);
  }

  @Delete('delete/:categoryId')
  deleteCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.deleteCategory(categoryId);
  }
}
