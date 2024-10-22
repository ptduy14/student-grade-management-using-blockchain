import { Injectable } from '@nestjs/common';
import { TeachersService } from 'src/teachers/teachers.service';
import { LoginDto } from './dtos/login.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { TeacherDto } from 'src/teachers/dto/teacher.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly teacherService: TeachersService,
    private readonly jwtService: JwtService,
  ) {}

  async teacherCredentialByPassword(loginDto: LoginDto) {
    const teacherFound = await this.teacherService.findByEmail(loginDto.email);

    if (!teacherFound) {
      throw new HttpException('Không tìm thấy tài khoản', HttpStatus.NOT_FOUND);
    }

    const isMatched = await bcrypt.compare(
      loginDto.password,
      teacherFound.teacher_password,
    );

    if (!isMatched) {
      throw new HttpException(
        'Mật khẩu không chính xác',
        HttpStatus.UNAUTHORIZED,
      );
    }
    console.log(plainToClass(TeacherDto, teacherFound));
    return plainToClass(TeacherDto, teacherFound);
  }

  async generateToken(user: any) {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      ...payload,
      acess_token: this.jwtService.sign(payload),
    };
  }

  async getTeacherProfile(auth: any) {
    const teacher = this.teacherService.findByEmail(auth.email);

    if (!teacher) {
      throw new HttpException(
        'Không tìm thấy thông tin giảng viên',
        HttpStatus.NOT_FOUND,
      );
    }

    return plainToClass(TeacherDto, teacher);
  }

  async changeTeacherPassword(auth: any, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new HttpException('Mật khẩu không khớp', HttpStatus.BAD_REQUEST);
    }

    const teacher = await this.teacherService.findByEmail(auth.email);

    if (!teacher) {
      throw new HttpException('Không tìm thấy tài khoản', HttpStatus.NOT_FOUND);
    }

    const isMatched = await bcrypt.compare(
      changePasswordDto.oldPassword,
      teacher.teacher_password,
    );

    if (!isMatched) {
      throw new HttpException(
        'Mật khẩu không chính xác',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.teacherService.updatePassword({
      ...teacher,
      teacher_password: hashedPassword,
    });

    return 'Cập nhật mật khẩu thành công';
  }
}
