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
import { ReportService } from './report.service';
import { AddReportDto, UpdateReportDto } from './dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { FirebaseJwtGuard } from 'src/auth/guard';
import { User } from 'src/user/type/user.type';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('add/:userId')
  @UseGuards(FirebaseJwtGuard)
  addReport(
    @Param('userId') userId: string,
    @GetUser() author: User,
    @Body() content: AddReportDto,
  ) {
    return this.reportService.addReport(userId, author.id, content);
  }

  @Put('update/:id')
  updateReport(@Param('id') id: string, @Body() content: UpdateReportDto) {
    return this.reportService.updateReport(id, content);
  }

  @Delete('delete/:id')
  deleteReport(@Param('id') id: string) {
    return this.reportService.deleteReport(id);
  }

  @Get('user')
  @UseGuards(FirebaseJwtGuard)
  getUserReports(@GetUser() user: User) {
    return this.reportService.findReportsByUserId(user.id);
  }

  @Get('author')
  @UseGuards(FirebaseJwtGuard)
  getAuthorReports(@GetUser() author: User) {
    return this.reportService.findReportsByAuthorId(author.id);
  }

  @Get(':userId')
  getReportsByUserId(@Param('userId') userId: string) {
    return this.reportService.findReportsByUserId(userId);
  }
}
