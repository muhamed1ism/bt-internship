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

  @Post(':teamId/add')
  async addMembers(
    @Param('teamId') teamId: string,
    @Body() membersData: AddMembersDto,
  ) {
    return this.memberService.addMembers(teamId, membersData);
  }

  @Put(':teamId/update-position/:userId')
  async updateMemberPosition(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Body() memberData: UpdateMemberPositionDto,
  ) {
    return this.memberService.updateMemberPosition(teamId, userId, memberData);
  }

  @Delete(':teamId/delete/:userId')
  async deleteMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.memberService.deleteMember(teamId, userId);
  }
}
