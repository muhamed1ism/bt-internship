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
import { LevelService } from './level.service';
import { CreateLevelDto, UpdateLevelDto } from './dto';
import { FirebaseJwtGuard } from 'src/auth/guard';
import { AbilitiesGuard } from 'src/casl/abilities/guard';
import { CheckAbilities, RequestAbility } from 'src/casl/abilities/decorator';
import {
  Action,
  AppAbility,
  Subject,
} from 'src/casl/ability-factory/casl-ability.factory';

@Controller('bucket/level')
@UseGuards(FirebaseJwtGuard, AbilitiesGuard)
export class LevelController {
  constructor(private levelService: LevelService) {}

  @Get('all/:categoryId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.BucketLevel),
  )
  getAllCategoryLevels(
    @Param('categoryId') categoryId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Read, Subject.BucketLevel)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.levelService.getAllCategoryLevels(categoryId);
  }

  @Get('user/:categoryId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.BucketLevel),
  )
  getUserCategoryLevel(
    @Param('categoryId') categoryId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Read, Subject.BucketLevel)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.levelService.getUserCategoryLevel(categoryId);
  }

  @Post('create/:categoryId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Create, Subject.BucketLevel),
  )
  createLevel(
    @Param('categoryId') categoryId: string,
    @Body() levelData: CreateLevelDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Create, Subject.BucketLevel)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.levelService.createLevel(categoryId, levelData);
  }

  @Put('update/:levelId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.BucketLevel),
  )
  updateLevel(
    @Param('levelId') levelId: string,
    @Body() levelData: UpdateLevelDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Update, Subject.BucketLevel)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.levelService.updateLevel(levelId, levelData);
  }

  @Delete('delete/:levelId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Delete, Subject.BucketLevel),
  )
  deleteLevel(
    @Param('levelId') levelId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Delete, Subject.BucketLevel)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.levelService.deleteLevel(levelId);
  }
}
