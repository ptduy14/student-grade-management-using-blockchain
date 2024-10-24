import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';

@ApiBearerAuth()
@ApiTags("STUDENT")
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN)
  @ApiOperation({summary: "Craete student"})
  @Post()
  async create(@Body(ValidationPipe) createStudentDto: CreateStudentDto) {
    return await this.studentsService.create(createStudentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN)
  @ApiOperation({summary: "Get all students"})
  @Get()
  async findAll() {
    return await this.studentsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN, TeacherRoleEnum.TEACHER)
  @ApiOperation({summary: "Get student"})
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.studentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN)
  @ApiOperation({summary: "update student"})
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateStudentDto: UpdateStudentDto) {
    return await this.studentsService.update(id, updateStudentDto);
  }
}
