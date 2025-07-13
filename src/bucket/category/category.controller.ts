import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CategoryService } from './category.service';
import { FirebaseJwtGuard } from 'src/auth/guard';
import { AbilitiesGuard } from 'src/casl/abilities/guard';
import { CheckAbilities, RequestAbility } from 'src/casl/abilities/decorator';
import {
  Action,
  AppAbility,
  Subject,
} from 'src/casl/ability-factory/casl-ability.factory';

@Controller('bucket/category')
@UseGuards(FirebaseJwtGuard, AbilitiesGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // Remove the if statement and @CheckAbilities decorator
  // if all bucket categories should be returned to all roles
  @Get('all')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.BucketCategory),
  )
  getAllCategories(@RequestAbility() ability: AppAbility) {
    if (ability.cannot(Action.Read, Subject.BucketCategory)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.categoryService.getAllCategories();
  }

  @Get(':categoryId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.BucketCategory),
  )
  getCategoryById(
    @Param('categoryId') categoryId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Read, Subject.BucketCategory)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.categoryService.getCategoryById(categoryId);
  }

  @Post('create')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Create, Subject.BucketCategory),
  )
  createCategory(
    @Body() categoryData: CreateCategoryDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Create, Subject.BucketCategory)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.categoryService.createCategory(categoryData);
  }

  @Put('update/:categoryId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.BucketCategory),
  )
  updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() categoryData: UpdateCategoryDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Update, Subject.BucketCategory)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.categoryService.updateCategory(categoryId, categoryData);
  }

  @Delete('delete/:categoryId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Delete, Subject.BucketCategory),
  )
  deleteCategory(
    @Param('categoryId') categoryId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Delete, Subject.BucketCategory)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.categoryService.deleteCategory(categoryId);
  }
}
