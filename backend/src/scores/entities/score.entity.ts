import { TransactionHistory } from 'src/transaction-history/entities/transaction-history.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  score_id: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  midterm_score: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  final_score: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  total_score: number | null;

  @OneToMany(() => TransactionHistory, (transactionHistory) => transactionHistory.score, {cascade: true})
  transaction_histories: TransactionHistory[]
}
