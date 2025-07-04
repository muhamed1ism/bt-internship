import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BucketService } from './bucket.service';
import { AssignBucketsDto } from './dto/assign-buckets.dto';
import { FirebaseJwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from '../type/user.type';

@Controller('user/bucket')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  // Keep above @Get('/:userId')
  @Get('/my')
  @UseGuards(FirebaseJwtGuard)
  getMyBuckets(@GetUser() user: User) {
    return this.bucketService.getUserBuckets(user.id);
  }

  @Get('/:userId')
  getUserBuckets(@Param('userId') userId: string) {
    return this.bucketService.getUserBuckets(userId);
  }

  @Post('/:userId/assign')
  assignBucketsToUser(
    @Param('userId') userId: string,
    @Body() bucketIds: AssignBucketsDto,
  ) {
    return this.bucketService.assignBucketsToUser(userId, bucketIds);
  }

  @Put('/:userId/promote/:bucketLevelId')
  promoteUser(
    @Param('userId') userId: string,
    @Param('bucketLevelId') bucketLevelId: string,
  ) {
    return this.bucketService.promoteUserBucketLevel(userId, bucketLevelId);
  }

  @Delete('/:userId/unassign/:bucketLevelId')
  unassignBucketFromUser(
    @Param('userId') userId: string,
    @Param('bucketLevelId') bucketLevelId: string,
  ) {
    return this.bucketService.unassignUserBucket(userId, bucketLevelId);
  }
}
