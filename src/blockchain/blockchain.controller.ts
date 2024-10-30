import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { CreateBlockchainDto } from './dto/create-blockchain.dto';
import { UpdateBlockchainDto } from './dto/update-blockchain.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags("BLOCKCHAIN")
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @ApiOperation({summary: "Lấy toàn bộ điểm các học phần của sinh viên trong học kì"})
  @Get()
  async getAllCourseSectionInSemester() {
    return await this.blockchainService.getAllGradeByStudentAndSemester(1, 1);
  }
}
