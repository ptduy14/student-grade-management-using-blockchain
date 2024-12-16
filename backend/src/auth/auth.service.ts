import { Injectable } from '@nestjs/common';
import { TeachersService } from 'src/teachers/teachers.service';
import { LoginDto } from './dtos/login.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { TeacherDto } from 'src/teachers/dto/teacher.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { StudentsService } from 'src/students/students.service';
import { StudentDto } from 'src/students/dto/student.dto';
import { extractDomain } from 'common/utils/extract-domain.util';
import { AddWalletAddressDto } from './dtos/add-wallet-address.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly teacherService: TeachersService,
    private readonly studentService: StudentsService,
    private readonly jwtService: JwtService,
  ) {}

  async teacherCredentialByPassword(loginDto: LoginDto) {
    const teacherFound = await this.teacherService.findByEmail(loginDto.email);

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

    return plainToClass(TeacherDto, teacherFound);
  }

  async studentCredentialByPassword(loginDto: LoginDto) {
    const studentFound = await this.studentService.findByEmail(loginDto.email);

    const isMatched = await bcrypt.compare(
      loginDto.password,
      studentFound.student_password,
    );

    if (!isMatched) {
      throw new HttpException(
        'Mật khẩu không chính xác',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return plainToClass(StudentDto, studentFound);
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

    return plainToClass(TeacherDto, teacher);
  }

  async getStudentProfile(auth: any) {
    const student = this.studentService.findByEmail(auth.email);

    return plainToClass(StudentDto, student);
  }

  async changePassword(auth: any, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new HttpException('Mật khẩu không khớp', HttpStatus.BAD_REQUEST);
    }

    if (extractDomain(auth.email) === 'ctuet.edu.vn') {
      const teacher = await this.teacherService.findByEmail(auth.email);

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

      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );

      await this.teacherService.updatePassword({
        ...teacher,
        teacher_password: hashedPassword,
      });
    } else {
      const student = await this.studentService.findByEmail(auth.email);

      const isMatched = await bcrypt.compare(
        changePasswordDto.oldPassword,
        student.student_password,
      );

      if (!isMatched) {
        throw new HttpException(
          'Mật khẩu không chính xác',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );

      await this.studentService.updatePassword({
        ...student,
        teacher_password: hashedPassword,
      });
    }

    return 'Cập nhật mật khẩu thành công';
  }

  async checkWalletAddress(auth: any) {
    return await this.teacherService.checkWalletAddress(auth.id);
  }  

  async addWalletAddress(auth: any, addWalletAddressDto: AddWalletAddressDto) {
    return this.teacherService.addWalletAddress(auth.id, addWalletAddressDto.wallet_address);
  }
}
