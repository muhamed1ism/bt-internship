import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { FirebaseJwtGuard } from '../auth/guard/firebase-jwt.guard';
import { EvaluationRequest, EvaluationResponse } from './dto/evaluation.types';
import { EvaluateEmployeeDto } from './dto/evaluate.dto';

@Controller('evaluation')
@UseGuards(FirebaseJwtGuard)
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  @Post('analyze')
  async analyzeEvaluation(@Body() request: EvaluationRequest): Promise<EvaluationResponse> {
    return this.evaluationService.analyzeEmployee(request);
  }

  @Post('evaluate')
  async evaluateEmployee(@Body() body: EvaluateEmployeeDto): Promise<EvaluationResponse> {
    return this.evaluationService.evaluateEmployee(
      body.userId,
      body.categoryId,
      [], // reports
      [], // messages  
      [] // bucket levels
    );
  }
} 