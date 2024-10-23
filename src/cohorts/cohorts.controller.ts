import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CohortsService } from './cohorts.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';
import { Roles } from 'common/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('Cohort')
@Controller('cohorts')
export class CohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN)
  @Post('/create')
  @ApiOperation({ summary: 'Create cohort' })
  create(@Body() createCohortDto: CreateCohortDto) {
    return this.cohortsService.create(createCohortDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN, TeacherRoleEnum.TEACHER)
  @Get()
  @ApiOperation({ summary: 'Get all cohort' })
  findAll() {
    return this.cohortsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TeacherRoleEnum.ADMIN, TeacherRoleEnum.TEACHER)
  @ApiOperation({ summary: 'Get cohort' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cohortsService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCohortDto: UpdateCohortDto) {
  //   return this.cohortsService.update(+id, updateCohortDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cohortsService.remove(+id);
  // }
}
