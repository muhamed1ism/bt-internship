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
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './dto';
import { FirebaseJwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/type/user.type';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('all')
  getAllTeams() {
    return this.teamService.getAllTeams();
  }

  @Get('my')
  @UseGuards(FirebaseJwtGuard)
  getMyTeams(@GetUser() user: User) {
    return this.teamService.getMyTeams(user.id);
  }

  @Post('add')
  addTeam(@Body() teamData: CreateTeamDto) {
    return this.teamService.createTeam(teamData);
  }

  @Put('update/:teamId')
  updateTeam(@Param('teamId') teamId: string, @Body() teamData: UpdateTeamDto) {
    return this.teamService.updateTeam(teamId, teamData);
  }

  @Delete('delete/:teamId')
  deleteTeam(@Param('teamId') teamId: string) {
    return this.teamService.deleteTeam(teamId);
  }
}
