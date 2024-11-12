import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CourseSectionService } from './course-section.service';
import { CreateCourseSectionDto } from './dto/create-course-section.dto';
import { UpdateCourseSectionDto } from './dto/update-course-section.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { UserRoleEnum } from 'common/enums/user-role.enum';
import { Auth } from 'common/decorators/auth.decorator';

@ApiBearerAuth()
@ApiTags('COURSE SECTION')
@Controller('course-section')
export class CourseSectionController {
  constructor(private readonly courseSectionService: CourseSectionService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Tạo lớp học phần' })
  @Post()
  async create(
    @Body(ValidationPipe) createCourseSectionDto: CreateCourseSectionDto,
  ) {
    return await this.courseSectionService.create(createCourseSectionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Lấy tất cả lớp học phần hiện có' })
  @Get()
  async findAll() {
    return await this.courseSectionService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Lấy tất cả lớp học phần theo học kì' })
  @Get('semesters/:id')
  async findAllBySemester(@Param('id', ParseIntPipe) id: number) {
    return await this.courseSectionService.findAllBySemester(id);
  }

  // Lấy danh sách tất cả lớp học phần mà giáo viên giảng dạy
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.TEACHER)
  @ApiOperation({
    summary: 'Lấy danh sách tất cả lớp học phần giáo viên giảng dạy (AUTH)',
  })
  @Get('teacher')
  async findAllCourseSectionsByTeacher(@Auth() auth: any) {
    return await this.courseSectionService.findAllCourseSectionsByTeacher(auth);
  }

  // Lấy danh sách lớp học phần mà giáo viên giảng dạy theo học kì
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.TEACHER)
  @ApiOperation({
    summary:
      'Lấy danh sách lớp học phần giáo viên giảng dạy theo học kì (AUTH)',
  })
  @Get('teacher/semesters/:id')
  async findAllCourseSectionsByTeacherAndSemester(
    @Auth() auth: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.courseSectionService.findAllCourseSectionsByTeacherAndSemester(
      auth,
      id,
    );
  }

  // Tìm kiếm lớp học phần giảng viên dạy trong học kì
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.TEACHER)
  @ApiOperation({
    summary: 'Tìm kiếm lớp học phần giảng viên dạy trong học kì (Auth)',
  })
  @Get('teacher/semesters/:id/search')
  async findTeacherCourseSectionsInSemester(
    @Auth() auth: any,
    @Param('id', ParseIntPipe) id: number,
    @Query('course_section_name', ValidationPipe) course_section_name: string,
  ) {
    return await this.courseSectionService.findTeacherCourseSectionsInSemester(
      auth,
      id,
      course_section_name,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.TEACHER)
  @ApiOperation({ summary: 'Lấy chi tiết lớp học phần' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.courseSectionService.findOne(id);
  }

  // Lấy danh sách sinh viên trong lớp học phần và điểm
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.TEACHER)
  @ApiOperation({
    summary: 'Lấy danh sách sinh viên trong lớp học phần và điểm',
  })
  @Get(':id/students-with-score')
  async findAllStudentsAndScoreInCourseSection(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.courseSectionService.findAllStudentsAndScoreInCourseSection(
      id,
    );
  }

  // Tìm kiếm sinh viên trong lớp học phần
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.TEACHER)
  @ApiOperation({ summary: 'Tìm kiếm sinh viên trong lớp học phần' })
  @Get(':id/search/student')
  async findStudentByNameInCourseSection(
    @Param('id', ParseIntPipe) id: number,
    @Query('student_name', ValidationPipe) student_name: string,
  ) {
    return await this.courseSectionService.findStudentByNameInCourseSection(
      id,
      student_name,
    );
  }
}
