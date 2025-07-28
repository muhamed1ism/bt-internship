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
import { BucketService } from './bucket.service';
import { AssignBucketsDto } from './dto/assign-buckets.dto';
import { FirebaseJwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from '../type/user.type';
import { AbilitiesGuard } from 'src/casl/abilities/guard/abilities.guard';
import { CheckAbilities, RequestAbility } from 'src/casl/abilities/decorator';
import {
  Action,
  AppAbility,
  Subject,
} from 'src/casl/ability-factory/casl-ability.factory';
import { subject } from '@casl/ability';

@Controller('user/bucket')
@UseGuards(FirebaseJwtGuard, AbilitiesGuard)
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  // Keep above @Get('/:userId')
  @Get('/my')
  getMyBuckets(@GetUser() user: User) {
    return this.bucketService.getUserBuckets(user.id);
  }

  @Get('/:userId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.UserBucket),
  )
  getUserBuckets(
    @Param('userId') userId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Read, Subject.UserBucket)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.bucketService.getUserBuckets(userId);
  }

  @Post('/:userId/assign')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Create, Subject.UserBucket),
  )
  assignBucketsToUser(
    @Param('userId') userId: string,
    @Body() bucketIds: AssignBucketsDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Create, Subject.UserBucket)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.bucketService.assignBucketsToUser(userId, bucketIds);
  }

  @Put('/:userId/promote/:bucketLevelId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.UserBucket),
  )
  promoteUser(
    @Param('userId') userId: string,
    @Param('bucketLevelId') bucketLevelId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Update, Subject.UserBucket)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.bucketService.promoteUserBucketLevel(userId, bucketLevelId);
  }

  @Delete('/:userId/unassign/:bucketLevelId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Delete, Subject.UserBucket),
  )
  unassignBucketFromUser(
    @Param('userId') userId: string,
    @Param('bucketLevelId') bucketLevelId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Delete, Subject.UserBucket)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.bucketService.unassignUserBucket(userId, bucketLevelId);
  }
}
