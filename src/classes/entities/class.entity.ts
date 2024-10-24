import { Cohort } from "src/cohorts/entities/cohort.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    class_id: number

    @Column()
    class_display_name_id: string

    @Column()
    class_name: string

    @Column({default: 0})
    total_student: number

    @ManyToOne(() => Cohort, (cohort) => cohort.classes)
    cohort: Cohort
}
