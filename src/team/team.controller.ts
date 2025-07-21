import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './dto';
import { FirebaseJwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/type/user.type';
import { AbilitiesGuard } from 'src/casl/abilities/guard';
import { CheckAbilities, RequestAbility } from 'src/casl/abilities/decorator';
import {
  Action,
  AppAbility,
  Subject,
} from 'src/casl/ability-factory/casl-ability.factory';
import { subject } from '@casl/ability';

@Controller('team')
@UseGuards(FirebaseJwtGuard, AbilitiesGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('all')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.Team),
  )
  async getAllTeams(@RequestAbility() ability: AppAbility) {
    const teams = await this.teamService.getAllTeamsWithLeaders();

    const filteredTeams = teams.filter((team) =>
      ability.can(Action.Read, subject(Subject.Team, team)),
    );

    if (filteredTeams.length === 0) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return filteredTeams;
  }

  @Get('all-with-leaders')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.Team),
  )
  async getAllTeamsWithLeaders(@RequestAbility() ability: AppAbility) {
    const teams = await this.teamService.getAllTeamsWithLeaders();

    const filteredTeams = teams.filter((team) =>
      ability.can(Action.Read, subject(Subject.Team, team)),
    );

    if (filteredTeams.length === 0) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return filteredTeams;
  }

  @Get('user')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.Team),
  )
  @UseGuards(FirebaseJwtGuard)
  getUserTeams(@GetUser() user: User) {
    return this.teamService.getUserTeams(user.id);
  }

  @Get(':teamId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.Team),
  )
  async getTeamById(
    @Param('teamId') teamId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    const team = await this.teamService.getTeamById(teamId);

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (ability.cannot(Action.Read, subject(Subject.Team, team))) {
      throw new ForbiddenException(
        'You are not authorized to access this team',
      );
    }

    return team;
  }

  @Post('add')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Create, Subject.Team),
  )
  addTeam(
    @Body() teamData: CreateTeamDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Create, Subject.Team)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.teamService.createTeam(teamData);
  }

  @Put('update/:teamId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.Team),
  )
  updateTeam(
    @Param('teamId') teamId: string,
    @Body() teamData: UpdateTeamDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Update, Subject.Team)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.teamService.updateTeam(teamId, teamData);
  }

  @Delete('delete/:teamId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Delete, Subject.Team),
  )
  deleteTeam(
    @Param('teamId') teamId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Delete, Subject.Team)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.teamService.deleteTeam(teamId);
  }
}
