import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddWalletAddressDto {
    @ApiProperty()
    @IsString()
    wallet_address: string
}