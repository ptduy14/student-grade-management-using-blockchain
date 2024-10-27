import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { UserRoleEnum } from 'common/enums/user-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('TEACHER')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Post('/create')
  @ApiOperation({ summary: 'Tạo tài khoản giảng viên/admin' })
  async create(@Body(ValidationPipe) createTeacherDto: CreateTeacherDto) {
    return await this.teachersService.create(createTeacherDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách giảng viên/admin hiện có' })
  findAll() {
    return this.teachersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết tài khoản giảng viên/admin' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật tài khoản giảng viên/admin' })
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa tài khoản giảng viên/admin (không khuyến khích sử dụng)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.remove(id);
  }
}
