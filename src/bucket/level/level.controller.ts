import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto, UpdateLevelDto } from './dto';

@Controller('bucket/level')
export class LevelController {
  constructor(private levelService: LevelService) {}

  @Get('all/:categoryId')
  getAllCategoryLevels(@Param('categoryId') categoryId: string) {
    return this.levelService.getAllCategoryLevels(categoryId);
  }

  @Get('my/:categoryId')
  getMyCategoryLevel(@Param('categoryId') categoryId: string) {
    return this.levelService.getMyCategoryLevel(categoryId);
  }

  @Post('create/:categoryId')
  createLevel(
    @Param('categoryId') categoryId: string,
    @Body() levelData: CreateLevelDto,
  ) {
    return this.levelService.createLevel(categoryId, levelData);
  }

  @Put('update/:levelId')
  updateLevel(
    @Param('levelId') levelId: string,
    @Body() levelData: UpdateLevelDto,
  ) {
    return this.levelService.updateLevel(levelId, levelData);
  }

  @Delete('delete/:levelId')
  deleteLevel(@Param('levelId') levelId: string) {
    return this.levelService.deleteLevel(levelId);
  }
}
