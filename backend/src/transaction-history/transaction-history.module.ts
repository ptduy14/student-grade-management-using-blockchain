import { Module } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { TransactionHistoryController } from './transaction-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionHistory } from './entities/transaction-history.entity';
import { ScoresModule } from 'src/scores/scores.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionHistory]), ScoresModule],
  controllers: [TransactionHistoryController],
  providers: [TransactionHistoryService],
  exports: [TransactionHistoryService]
})
export class TransactionHistoryModule {}
