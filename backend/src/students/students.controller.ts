import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, ParseIntPipe, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { UserRoleEnum } from 'common/enums/user-role.enum';

@ApiBearerAuth()
@ApiTags("STUDENT")
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({summary: "Thêm mới sinh viên"})
  @Post()
  async create(@Body(ValidationPipe) createStudentDto: CreateStudentDto) {
    return await this.studentsService.create(createStudentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({summary: "Lấy danh sách sinh viên"})
  @Get()
  async findAll() {
    return await this.studentsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({summary: "Tìm kiếm sinh viên theo tên"})
  @Get('/search-by-name')
  async searchByName(@Query('student_name', ValidationPipe) student_name: string) {
    return await this.studentsService.searchByName(student_name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.TEACHER)
  @ApiOperation({summary: "Lấy chi tiết sinh viên"})
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.studentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({summary: "Cập nhật sinh viên"})
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateStudentDto: UpdateStudentDto) {
    return await this.studentsService.update(id, updateStudentDto);
  }
}
