import { Controller, Get, UseGuards, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { AbilitiesGuard } from '../casl/abilities/guard/abilities.guard';
import { CheckAbilities } from '../casl/abilities/decorator/check-abilities.decorator';
import {
  Action,
  AppAbility,
  Subject,
} from '../casl/casl-ability.factory/casl-ability.factory';
import { subject } from '@casl/ability';
import { RequestAbility } from '../casl/abilities/decorator/request-ability.decorator';
import { FirebaseJwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@UseGuards(FirebaseJwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current-user')
  @UseGuards(FirebaseJwtGuard)
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('all')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.User),
  )
  async findAll(@RequestAbility() ability: AppAbility) {
    const users = await this.userService.findAll();

    const filteredUsers = users.filter((user) =>
      ability.can(Action.Read, subject(Subject.User, user)),
    );

    if (filteredUsers.length === 0)
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );

    return filteredUsers;
  }
}
