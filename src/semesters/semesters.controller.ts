import { Controller, Get, Param, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRoleEnum } from 'common/enums/user-role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('SEMESTER')
@Controller('semesters')
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.TEACHER)
  @ApiOperation({summary: 'Lấy danh sách học kì' })
  @Get()
  async findAll() {
    return await this.semestersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.TEACHER)
  @ApiOperation({summary: 'Lấy học kì hiện tại đang mở' })
  @Get('/current-open-semester')
  async findCurrentOpenSemester() {
    return await this.semestersService.findCurrentOpenSemester();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.TEACHER)
  @ApiOperation({summary: 'Lấy chi tiết học kì' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.semestersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({summary: 'Mở trạng thái học kì' })
  @Patch(':id')
  async openSemester(@Param('id', ParseIntPipe) id: number) {
    return await this.semestersService.openSemester(id);
  }
}
