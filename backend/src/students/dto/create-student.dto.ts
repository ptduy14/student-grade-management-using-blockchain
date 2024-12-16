import { IsNotEmpty, MinLength, IsString, MaxLength, Length, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    student_name: string;   
    
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    @MaxLength(20, { message: 'Mật khẩu không được quá 20 ký tự' })
    @IsString()
    student_password: string;  
    
    @ApiProperty()
    @Length(10, 10, { message: 'Số điện thoại phải có 10 ký tự' })
    @IsString()
    student_phone: string;    
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    student_address: string;  
    
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(1, {message: "class_id không hợp lệ"})
    class_id: number;        

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(1, {message: "cohort_id không hợp lệ"})
    cohort_id: number;   
}
