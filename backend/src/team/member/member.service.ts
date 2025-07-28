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
      select: {
        id: true,
        teamId: true,
        joinedAt: true,
        position: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            phoneNumber: true,
            status: true,
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!members || members.length === 0) {
      throw new NotFoundException('Members not found');
    }

    return members;
  }

  async getTeamLeaders(teamId: string) {
    const teamLeaders = await this.prisma.teamMember.findMany({
      where: {
        id: teamId,
        position: {
          contains: 'lead',
        },
      },
      select: {
        joinedAt: true,
        position: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            phoneNumber: true,
            status: true,
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!teamLeaders) throw new NotFoundException('No team leader found');

    return teamLeaders;
  }

  async getAvailableUsers(teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found.');
    }

    const users = await this.prisma.user.findMany({
      where: {
        teams: {
          none: {
            teamId,
          },
        },
      },
    });

    if (!users) {
      throw new NotFoundException('Available users not found.');
    }

    return users;
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

  async updateMemberPosition(memberId: string, dto: UpdateMemberPositionDto) {
    const member = await this.prisma.teamMember.update({
      where: {
        id: memberId,
      },
      data: { position: dto.position },
    });

    if (!member) throw new NotFoundException('Team member not found');

    return member;
  }

  async deleteMember(memberId: string) {
    try {
      await this.prisma.teamMember.delete({
        where: {
          id: memberId,
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
