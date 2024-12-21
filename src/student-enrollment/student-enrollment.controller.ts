import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { StudentEnrollmentService } from './student-enrollment.service';
import { CreateStudentEnrollmentDto } from './dto/create-student-enrollment.dto';
import { UpdateStudentEnrollmentDto } from './dto/update-student-enrollment.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnum } from 'common/enums/user-role.enum';
import { Roles } from 'common/decorators/roles.decorator';
import { Auth } from 'common/decorators/auth.decorator';

@ApiBearerAuth()
@ApiTags("STUDENT ENROLLMENT")
@Controller('student-enrollment')
export class StudentEnrollmentController {
  constructor(private readonly studentEnrollmentService: StudentEnrollmentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Admin đăng ký học phần cho sinh viên' })
  @Post('admin/register')
  async registerStudent(@Body(ValidationPipe) createStudentEnrollmentDto: CreateStudentEnrollmentDto) {
    return await this.studentEnrollmentService.enroll(createStudentEnrollmentDto);
  }

  // chỉ dành cho role sinh viên
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.STUDENT)
  @ApiOperation({ summary: 'Sinh viên lấy tất kết quả học tập của các học phần trong các học kỳ' })
  @Get('student/results')
  getAllAcademicResults(@Auth() auth: any) {
    return this.studentEnrollmentService.findAll(auth, null);
  }

  // chỉ dành cho role sinh viên
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Admin lấy tất cả kết quả học tập của các học phần trong các học kỳ của sinh viên' })
  @Get('admin/students/:studentId/results')
  getAllAcademicResultsByStudentId(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.studentEnrollmentService.findAll(null, studentId);
  }

  // chỉ dành cho role sinh viên
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.STUDENT)
  @ApiOperation({ summary: 'Sinh viên lấy tất kết quả học tập của các học phần trong các học kỳ cụ thể' })
  @Get('student/results/semesters/:semesterId')
  getAcademicResultsBySemester(@Auth() auth: any, @Param('semesterId', ParseIntPipe) semesterId: number) {
    return this.studentEnrollmentService.findBySemesterId(auth, semesterId);
  }
}
