import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddReportDto, UpdateReportDto } from './dto';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async addReport(userId: string, authorId: string, dto: AddReportDto) {
    return this.prisma.report.create({
      data: {
        content: dto.content,
        authorId,
        userId,
      },
    });
  }

  async updateReport(reportId: string, dto: UpdateReportDto) {
    return this.prisma.report.update({
      where: { id: reportId },
      data: { content: dto.content },
    });
  }

  async deleteReport(reportId: string) {
    return this.prisma.report.delete({
      where: { id: reportId },
    });
  }

  async findReportsByUserId(userId: string) {
    const reports = this.prisma.report.findMany({
      where: { userId },
    });

    if (!reports) {
      throw new NotFoundException('Reports not found');
    }

    return reports;
  }

  async findReportsByAuthorId(authorId: string) {
    const reports = this.prisma.report.findMany({
      where: { authorId },
    });

    if (!reports) {
      throw new NotFoundException('Reports not found');
    }

    return reports;
  }
}
