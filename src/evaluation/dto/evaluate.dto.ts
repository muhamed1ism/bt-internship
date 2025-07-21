import { IsString, IsNotEmpty } from 'class-validator';

export class EvaluateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
} 