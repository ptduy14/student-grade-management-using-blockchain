import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateAcademicYearDto {
    

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    academic_year_start: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    academic_year_end: number;
}
