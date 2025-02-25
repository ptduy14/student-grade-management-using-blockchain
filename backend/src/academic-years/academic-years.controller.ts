import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { UserRoleEnum } from 'common/enums/user-role.enum';

@ApiBearerAuth()
@ApiTags('ACADEMIC YEAR')
@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Post('/create')
  @ApiOperation({ summary: 'Tạo năm học mới' })
  create(@Body() createAcademicYearDto: CreateAcademicYearDto) {
    return this.academicYearsService.create(createAcademicYearDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.TEACHER)
  @Get()
  @ApiOperation({ summary: 'Lấy tất danh sách tất cả năm học' })
  findAll() {
    return this.academicYearsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.TEACHER)
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết năm học' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.academicYearsService.findOne(id);
  }
}
