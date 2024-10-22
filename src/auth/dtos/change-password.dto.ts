import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  @MaxLength(20, { message: 'Mật khẩu mới không được quá 20 ký tự' })
  newPassword: string;

  @ApiProperty()
  @IsString()
  confirmPassword: string;
}
