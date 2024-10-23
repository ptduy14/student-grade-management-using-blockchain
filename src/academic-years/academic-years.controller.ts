import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';

@ApiBearerAuth()
@ApiTags('ACADEMIC YEAR')
@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN)
  @Post('/create')
  @ApiOperation({ summary: 'Create academic year' })
  create(@Body() createAcademicYearDto: CreateAcademicYearDto) {
    return this.academicYearsService.create(createAcademicYearDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN, TeacherRoleEnum.TEACHER)
  @Get()
  @ApiOperation({ summary: 'Get all academic year' })
  findAll() {
    return this.academicYearsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN, TeacherRoleEnum.TEACHER)
  @Get(':id')
  @ApiOperation({ summary: 'Get academic year' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.academicYearsService.findOne(id);
  }
}
