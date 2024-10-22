import { Injectable } from '@nestjs/common';
import { TeachersService } from 'src/teachers/teachers.service';
import { LoginDto } from './dtos/login.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { TeacherDto } from 'src/teachers/dto/teacher.dto';
import { JwtService } from '@nestjs/jwt';

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
}
