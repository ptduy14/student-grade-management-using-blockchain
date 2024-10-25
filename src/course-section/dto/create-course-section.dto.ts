import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseSectionDto {
@ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  semester_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  course_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  teacher_id: number;
}
