import { PartialType } from '@nestjs/swagger';
import { CreateClassDto } from './create-class.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateClassDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    class_name: string
}
