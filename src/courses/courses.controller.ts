import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';

@ApiBearerAuth()
@ApiTags('COURSE')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN)
  @Post('/create')
  @ApiOperation({summary: 'Create course'})
  create(@Body(ValidationPipe) createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN)
  @Get()
  @ApiOperation({summary: 'Create all courses'})
  findAll() {
    return this.coursesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN, TeacherRoleEnum.TEACHER)
  @Get(':id')
  @ApiOperation({summary: 'Get course'})
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN)
  @ApiOperation({summary: 'Update course'})
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
