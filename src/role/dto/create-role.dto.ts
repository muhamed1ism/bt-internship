import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  permissionIds: string[];
}
