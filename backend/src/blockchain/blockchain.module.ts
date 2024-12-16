import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { ScoresModule } from 'src/scores/scores.module';
import { TransactionHistoryModule } from 'src/transaction-history/transaction-history.module';

@Module({
  imports: [ScoresModule, TransactionHistoryModule],
  controllers: [BlockchainController],
  providers: [BlockchainService],
})
export class BlockchainModule {}
