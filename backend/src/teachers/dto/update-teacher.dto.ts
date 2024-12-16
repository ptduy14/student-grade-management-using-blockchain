import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRoleEnum } from 'common/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeacherDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  teacher_name: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserRoleEnum)
  teacher_role: UserRoleEnum;
}
