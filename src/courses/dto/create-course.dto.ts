import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  course_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  course_credits: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  course_des: string;
}
