import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CourseSectionService } from './course-section.service';
import { CreateCourseSectionDto } from './dto/create-course-section.dto';
import { UpdateCourseSectionDto } from './dto/update-course-section.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';

@ApiBearerAuth()
@ApiTags('COURSE SECTION')
@Controller('course-section')
export class CourseSectionController {
  constructor(private readonly courseSectionService: CourseSectionService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN)
  @ApiOperation({summary: 'Tạo lớp học phần'})
  @Post()
  async create(@Body(ValidationPipe) createCourseSectionDto: CreateCourseSectionDto) {
    return await this.courseSectionService.create(createCourseSectionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN)
  @ApiOperation({summary: 'Lấy tất cả lớp học phần hiện có'})
  @Get()
  async findAll() {
    return await this.courseSectionService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Lấy chi tiết lớp học phần'})
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.courseSectionService.findOne(id);
  }
}
