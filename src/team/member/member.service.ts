import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddMemberDto, AddMembersDto } from './dto';
import { UpdateMemberPositionDto } from './dto/update-position.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMembers(teamId: string) {
    const members = await this.prisma.teamMember.findMany({
      where: {
        teamId,
      },
    });

    if (!members || members.length === 0) {
      throw new NotFoundException('Members not found');
    }

    return members;
  }

  async addMember(teamId: string, dto: AddMemberDto) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.prisma.teamMember.create({
      data: {
        teamId,
        userId: dto.userId,
        position: dto.position,
      },
    });
  }

  async addMembers(teamId: string, dto: AddMembersDto) {
    const results: any = [];

    for (const member of dto.members) {
      results.push(await this.addMember(teamId, member));
    }

    return results;
  }

  async updateMemberPosition(
    teamId: string,
    userId: string,
    dto: UpdateMemberPositionDto,
  ) {
    const member = await this.prisma.teamMember.update({
      where: {
        userId_teamId: {
          teamId,
          userId,
        },
      },
      data: { position: dto.position },
    });

    if (!member) throw new NotFoundException('Team member not found');

    return member;
  }

  async deleteMember(teamId: string, userId: string) {
    try {
      await this.prisma.teamMember.delete({
        where: {
          userId_teamId: {
            teamId,
            userId,
          },
        },
      });

      return { msg: 'User removed from team successfully' };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to remove member from team: ', error);
      }
      throw new NotFoundException('Team member not found');
    }
  }
}
