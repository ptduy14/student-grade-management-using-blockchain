import { IsInt, IsNotEmpty, IsString, IsPositive } from 'class-validator';

export class CreateCohortDto {
    @IsString()
    @IsNotEmpty()
    cohort_name: string;

    @IsInt()
    @IsPositive()
    cohort_number: number;

    @IsInt()
    @IsPositive()
    enrollment_year: number;

    // Trường createdAt không cần thiết phải thêm vào DTO
    // vì nó sẽ tự động được thiết lập khi lưu vào cơ sở dữ liệu
}
