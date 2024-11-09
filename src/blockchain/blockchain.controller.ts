import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { CreateBlockchainDto } from './dto/create-blockchain.dto';
import { UpdateBlockchainDto } from './dto/update-blockchain.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Auth } from 'common/decorators/auth.decorator';
import { PreviousDataScore } from './dto/previous-score-data.dto';

@ApiTags('BLOCKCHAIN')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @ApiOperation({
    summary: 'Lấy toàn bộ điểm các học phần của sinh viên trong một học kì',
  })
  @Get('students/:studentId/semesters/:semesterId/scores')
  async getAllCourseSectionInSemester(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('semesterId', ParseIntPipe) semesterId: number,
  ) {
    return await this.blockchainService.getAllGradeByStudentAndSemester(
      semesterId,
      studentId,
    );
  }

  @ApiOperation({
    summary: 'Lấy toàn điểm học phần của sinh viên trong một học kì',
  })
  @Get('students/:studentId/semesters/:semesterId/course-sections/:courseSectionId/scores')
  async getCourseSectionScoreInSemester(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('semesterId', ParseIntPipe) semesterId: number,
    @Param('courseSectionId', ParseIntPipe) courseSectionId: number,
  ) {
    return await this.blockchainService.getCourseSectionScoreInSemester(
      semesterId,
      studentId,
      courseSectionId
    );
  }

  @ApiOperation({
    summary: 'Lắng nghe giao dịch',
  })
  @Post('/listern-transaction')
  async listernTransaction(@Auth() auth, @Body() previousDataScore: PreviousDataScore) {
    return this.blockchainService.listenTransaction(previousDataScore);
  }
}
