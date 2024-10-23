import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('SEMESTER')
@Controller('semesters')
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN, TeacherRoleEnum.TEACHER)
  @Get()
  async findAll() {
    return await this.semestersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.semestersService.findOne(id);
  }
}
