import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTeams() {
    return this.prisma.team.findMany();
  }

  async getMyTeams(userId: string) {
    return this.prisma.team.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async createTeam(dto: CreateTeamDto) {
    const technologies = dto.technologies.map((tech) => ({
      where: { name: tech },
      create: { name: tech },
    }));

    return this.prisma.team.create({
      data: {
        name: dto.name,
        clientName: dto.clientName,
        documentation: dto.documentation,
        githubLink: dto.githubLink,
        startDate: dto.startDate || new Date(),
        projectDescription: dto.projectDescription,
        technologies: {
          connectOrCreate: technologies,
        },
      },
      include: {
        technologies: true,
      },
    });
  }

  async updateTeam(teamId: string, dto: UpdateTeamDto) {
    let technologyUpdate: any = undefined;
    if (dto.technologies) {
      technologyUpdate = {
        set: [],
        connectOrCreate: dto.technologies.map((tech) => ({
          where: { name: tech },
          create: { name: tech },
        })),
      };
    }

    return this.prisma.team.update({
      where: { id: teamId },
      data: {
        name: dto.name,
        clientName: dto.clientName,
        status: dto.status,
        startDate: dto.startDate,
        endDate: dto.endDate,
        projectDescription: dto.projectDescription,
        documentation: dto.documentation,
        githubLink: dto.githubLink,
        ...(technologyUpdate && { technologies: technologyUpdate }),
      },
      include: {
        technologies: true,
      },
    });
  }

  async deleteTeam(teamId: string) {
    try {
      await this.prisma.team.delete({
        where: { id: teamId },
      });

      return { msg: 'Team deleted successfully' };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to delete team');
      }
      throw new NotFoundException('Team not found');
    }
  }
}
