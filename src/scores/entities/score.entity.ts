import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
