import { Injectable } from '@nestjs/common';
import { CreateTransactionHistoryDto } from './dto/create-transaction-history.dto';
import { UpdateTransactionHistoryDto } from './dto/update-transaction-history.dto';
import { PreviousDataScore } from 'src/blockchain/dto/previous-score-data.dto';
import { ScoresService } from 'src/scores/scores.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHistory } from './entities/transaction-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionHistoryService {
  constructor(
    @InjectRepository(TransactionHistory)
    private readonly transactionHistoryRepository: Repository<TransactionHistory>,
    private readonly scoreService: ScoresService,
  ) {}
  async create(previousDataScore: PreviousDataScore, blockNumber: number) {
    const score = await this.scoreService.findById(previousDataScore.score_id);

    const transaction = new TransactionHistory();
    transaction.transaction_hash = previousDataScore.transaction_hash;
    transaction.transaction_type = previousDataScore.transaction_type;
    transaction.block_number = blockNumber;
    transaction.score = score; // Thiết lập quan hệ với Score

    return this.transactionHistoryRepository.save(transaction);
  }
}
