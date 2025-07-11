import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { AddMembersDto } from './dto';
import { UpdateMemberPositionDto } from './dto/update-position.dto';

@Controller('team/member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get(':teamId/all')
  async getMembers(@Param('teamId') teamId: string) {
    return this.memberService.getAllMembers(teamId);
  }

  @Get(':teamId/team-leaders')
  async getTeamLeaders(@Param('teamId') teamId: string) {
    return this.memberService.getTeamLeaders(teamId);
  }

  @Get(':teamId/available-users')
  async getAvailableUsers(@Param('teamId') teamId: string) {
    return this.memberService.getAvailableUsers(teamId);
  }

  @Post(':teamId/add')
  async addMembers(
    @Param('teamId') teamId: string,
    @Body() membersData: AddMembersDto,
  ) {
    return this.memberService.addMembers(teamId, membersData);
  }

  @Delete('delete/:memberId')
  async deleteMember(@Param('memberId') memberId: string) {
    return this.memberService.deleteMember(memberId);
  }

  @Put('/update-position/:memberId')
  async updateMemberPosition(
    @Param('memberId') memberId: string,
    @Body() memberData: UpdateMemberPositionDto,
  ) {
    return this.memberService.updateMemberPosition(memberId, memberData);
  }
}
