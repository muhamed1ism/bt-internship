import {
  Controller,
  Get,
  UseGuards,
  ForbiddenException,
  Put,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AbilitiesGuard } from '../casl/abilities/guard/abilities.guard';
import { CheckAbilities } from '../casl/abilities/decorator/check-abilities.decorator';
import {
  Action,
  AppAbility,
  Subject,
} from '../casl/ability-factory/casl-ability.factory';
import { RequestAbility } from '../casl/abilities/decorator/request-ability.decorator';
import { FirebaseJwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { subject } from '@casl/ability';

@Controller('user')
@UseGuards(FirebaseJwtGuard, AbilitiesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current-user')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('all')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.User),
  )
  async findAll(@RequestAbility() ability: AppAbility) {
    const users = await this.userService.findAll();

    const filteredUsers = users.filter((user) =>
      ability.can(Action.Read, subject(Subject.User, user)),
    );

    if (filteredUsers.length === 0) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return filteredUsers;
  }

  @Get('admins')
  async findAllAdmins() {
    return this.userService.getAllAdmins();
  }

  @Get('teammates')
  async getTeammates(@GetUser() user: User) {
    return this.userService.getTeammatesForUser(user.id);
  }

  @Get(':userId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.User),
  )
  async getUserById(
    @Param('userId') userId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    const user = this.userService.getUserById(userId);

    //
    // if (ability.cannot(Action.Read, subject(Subject.User, user))) {
    //   throw new ForbiddenException(
    //     'You are not authorized to access this resource',
    //   );
    // }

    return user;
  }

  @Put('profile')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.User),
  )
  async updateProfile(
    @Headers('authorization') authHeader: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @RequestAbility() ability: AppAbility,
  ) {
    // Ensure user can only update their own profile
    if (ability.cannot(Action.Update, Subject.User)) {
      throw new ForbiddenException(
        'You are not authorized to update user profiles',
      );
    }

    return this.userService.updateProfile(authHeader, updateProfileDto);
  }

  @Put(':userId/activate')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.User, 'status'),
  )
  async activateUser(
    @Param('userId') userId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Update, Subject.User)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.userService.activateUser(userId);
  }

  @Put(':userId/deactivate')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.User, 'status'),
  )
  async deactivateUser(
    @Param('userId') userId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Update, Subject.User)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.userService.deactivateUser(userId);
  }

  @Put(':userId/role/:roleId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.User, 'role'),
  )
  async updateRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Update, Subject.User)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.userService.updateRole(userId, roleId);
  }

  @Put(':userId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.User),
  )
  async updateUser(
    @Param('userId') userId: string,
    @Body() userData: UpdateProfileDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Update, Subject.User)) {
      throw new ForbiddenException(
        'You are not authorized to update user profiles',
      );
    }

    return this.userService.updateUser(userId, userData);
  }
}
