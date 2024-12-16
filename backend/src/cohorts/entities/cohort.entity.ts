import { Class } from "src/classes/entities/class.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cohort {
    @PrimaryGeneratedColumn()
    cohort_id: number

    @Column()
    cohort_name: string

    @Column()
    cohort_number: number

    @Column()
    enrollment_year: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date; // Thêm trường createdAt để lưu thời gian tạo

    @OneToMany(() => Class, (cls) => cls.cohort, {cascade: true})
    classes: Class[]
}
