import { ApiProperty } from "@nestjs/swagger";
import { IsInt, isInt, IsNotEmpty, IsString } from "class-validator";

export class CreateClassDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    class_name: string

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    cohort_id: number
}
