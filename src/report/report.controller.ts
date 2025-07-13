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
import { ReportService } from './report.service';
import { AddReportDto, UpdateReportDto } from './dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { FirebaseJwtGuard } from 'src/auth/guard';
import { User } from 'src/user/type/user.type';
import { AbilitiesGuard } from 'src/casl/abilities/guard';
import { CheckAbilities, RequestAbility } from 'src/casl/abilities/decorator';
import {
  Action,
  AppAbility,
  Subject,
} from 'src/casl/ability-factory/casl-ability.factory';
import { subject } from '@casl/ability';

@Controller('report')
@UseGuards(FirebaseJwtGuard, AbilitiesGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('user')
  getUserReports(@GetUser() user: User) {
    return this.reportService.findReportsByUserId(user.id);
  }

  @Get('author')
  getAuthorReports(@GetUser() authorUser: User) {
    return this.reportService.findReportsByAuthorId(authorUser.id);
  }

  @Get(':userId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.Report),
  )
  getReportsByUserId(
    @Param('userId') userId: string,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Read, subject(Subject.Report, { userId }))) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.reportService.findReportsByUserId(userId);
  }

  @Post('add/:userId')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Create, Subject.Report),
  )
  addReport(
    @Param('userId') userId: string,
    @GetUser() authorUser: User,
    @Body() content: AddReportDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (
      ability.cannot(
        Action.Create,
        subject(Subject.Report, { userId: authorUser.id }),
      )
    ) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.reportService.addReport(userId, authorUser.id, content);
  }

  @Put('update/:id')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Update, Subject.Report),
  )
  updateReport(
    @Param('id') id: string,
    @Body() content: UpdateReportDto,
    @RequestAbility() ability: AppAbility,
  ) {
    if (ability.cannot(Action.Update, Subject.Report)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.reportService.updateReport(id, content);
  }

  @Delete('delete/:id')
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Delete, Subject.Report),
  )
  deleteReport(@Param('id') id: string, @RequestAbility() ability: AppAbility) {
    if (ability.cannot(Action.Delete, Subject.Report)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return this.reportService.deleteReport(id);
  }
}
