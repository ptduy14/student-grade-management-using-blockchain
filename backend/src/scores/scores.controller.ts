import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'common/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { UserRoleEnum } from 'common/enums/user-role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Auth } from 'common/decorators/auth.decorator';

@ApiBearerAuth()
@ApiTags("SCORE")
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.TEACHER)
  @ApiOperation({ summary: 'Thêm điểm học phần' })
  @Post('/add')
  create(@Auth() auth: any,@Body(ValidationPipe) createScoreDto: CreateScoreDto) {
    return this.scoresService.create(auth, createScoreDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.TEACHER)
  @ApiOperation({ summary: 'Chỉnh sửa điểm học phần' })
  @Patch('/update')
  update(@Auth() auth: any, @Body() updateScoreDto: UpdateScoreDto) {
    return this.scoresService.update(auth, updateScoreDto);
  }
}
