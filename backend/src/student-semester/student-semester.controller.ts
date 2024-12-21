import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { StudentSemesterService } from './student-semester.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags("STUDENT SEMESTER")
@Controller('student-semester')
export class StudentSemesterController {
  constructor(private readonly studentSemesterService: StudentSemesterService) {}

  // Lấy tất cả học kỳ của sinh viên theo studentId
  @Get('student/:studentId')
  @ApiOperation({summary: "Lấy tất cả học kỳ của sinh viên theo studentId"})
  async getAllStudentSemesters(@Param('studentId', ParseIntPipe) studentId: number) {
      return await this.studentSemesterService.getAllStudentSemestersByStudentId(studentId);
  }

  // Lấy thông tin học kỳ cụ thể của sinh viên theo studentId và semesterId
  @Get('student/:studentId/semester/:semesterId')
  @ApiOperation({summary: "Lấy thông tin học kỳ cụ thể của sinh viên theo studentId và semesterId"})
  async getStudentSemester(@Param('studentId', ParseIntPipe) studentId: number, @Param('semesterId', ParseIntPipe) semesterId: number) {
      return await this.studentSemesterService.getStudentSemesterByStudentIdAndSemesterId(studentId, semesterId);
  }
}
