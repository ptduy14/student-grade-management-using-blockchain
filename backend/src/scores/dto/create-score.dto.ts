import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min, Max, IsEnum } from "class-validator";
import { ScoreTypeEnum } from "common/enums/score-type.enum";

export class CreateScoreDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    student_id: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    semester_id: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    course_section_id: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(10)
    score: number;

    @ApiProperty({ enum: ScoreTypeEnum })
    @IsEnum(ScoreTypeEnum)
    score_type: ScoreTypeEnum;
}
