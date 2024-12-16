import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  student_name: string;

  @ApiProperty()
  @Length(10, 10, { message: 'Số điện thoại phải có 10 ký tự' })
  @IsString()
  student_phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  student_address: string;
}
