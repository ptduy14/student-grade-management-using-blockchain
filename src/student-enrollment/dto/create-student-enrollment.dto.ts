import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentEnrollmentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    student_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    course_section_id: number;
}
