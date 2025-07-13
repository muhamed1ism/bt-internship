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
import { MemberService } from './member.service';
import { AddMembersDto } from './dto';
import { UpdateMemberPositionDto } from './dto/update-position.dto';
import { FirebaseJwtGuard } from 'src/auth/guard';
import { AbilitiesGuard } from 'src/casl/abilities/guard';
import { CheckAbilities, RequestAbility } from 'src/casl/abilities/decorator';
import {
  Action,
  AppAbility,
  Subject,
} from 'src/casl/ability-factory/casl-ability.factory';
import { subject } from '@casl/ability';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/type/user.type';

@Controller('team/member')
@UseGuards(FirebaseJwtGuard, AbilitiesGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get(':teamId/all')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.TeamMember),
  )
  async getMembers(
    @Param('teamId') teamId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    const teamMembers = await this.memberService.getAllMembers(teamId);

    if (ability.cannot(Action.Read, subject(Subject.TeamMember, teamMembers))) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return teamMembers;
  }

  @Get(':teamId/team-leaders')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.TeamMember),
  )
  async getTeamLeaders(
    @Param('teamId') teamId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Read, Subject.TeamMember)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.memberService.getTeamLeaders(teamId);
  }

  @Get(':teamId/available-users')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.TeamMember),
  )
  async getAvailableUsers(
    @Param('teamId') teamId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Read, Subject.TeamMember)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.memberService.getAvailableUsers(teamId);
  }

  @Post(':teamId/add')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Create, Subject.TeamMember),
  )
  async addMembers(
    @Param('teamId') teamId: string,
    @Body() membersData: AddMembersDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Create, Subject.TeamMember)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.memberService.addMembers(teamId, membersData);
  }

  @Put('/update-position/:memberId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.TeamMember),
  )
  async updateMemberPosition(
    @Param('memberId') memberId: string,
    @Body() memberData: UpdateMemberPositionDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Update, Subject.TeamMember)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.memberService.updateMemberPosition(memberId, memberData);
  }

  @Delete('delete/:memberId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Delete, Subject.TeamMember),
  )
  async deleteMember(
    @Param('memberId') memberId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Delete, Subject.TeamMember)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.memberService.deleteMember(memberId);
  }
}
