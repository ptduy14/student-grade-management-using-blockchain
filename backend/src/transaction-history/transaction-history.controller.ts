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
import { TransactionHistoryService } from './transaction-history.service';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnum } from 'common/enums/user-role.enum';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('TRANSACTION HISTORY')
@Controller('transaction-history')
export class TransactionHistoryController {
  constructor(
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get('')
  @ApiOperation({ summary: 'Lấy tất cả danh sách lịch sử transaction trên điểm' })
  async getAllTransactionHistories() {
    return await this.transactionHistoryService.getAllTransactionHistories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)
  @Get('/scores/:scoreId')
  @ApiOperation({ summary: 'Lấy danh sách lịch sử transaction trên điểm' })
  async getTransactionHistoriesByScoreId(@Param('scoreId', ParseIntPipe) scoreId: number) {
    return await this.transactionHistoryService.getTransactionHistoriesByScoreId(scoreId);
  }
}
