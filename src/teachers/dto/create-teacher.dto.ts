import { IsEnum, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';

export class CreateTeacherDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    teacher_name: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    teacher_email: string

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    @MaxLength(20, { message: 'Mật khẩu không được quá 20 ký tự' })
    @IsString()
    teacher_password: string

    @ApiProperty({default: TeacherRoleEnum.TEACHER})
    @IsEnum(TeacherRoleEnum)
    teacher_role: TeacherRoleEnum
}
