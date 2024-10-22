import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeacherDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  teacher_name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  teacher_email?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TeacherRoleEnum)
  teacher_role?: TeacherRoleEnum;
}
