import { TransactionTypeEnum } from 'common/enums/transaction-type.enum';
import { Score } from 'src/scores/entities/score.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class TransactionHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_hash: string;

  @Column({type: "enum", enum: TransactionTypeEnum})
  transaction_type: TransactionTypeEnum

  @Column()
  block_number: number;

  @ManyToOne(() => Score, (score) => score.transaction_histories)
  score: Score
}
