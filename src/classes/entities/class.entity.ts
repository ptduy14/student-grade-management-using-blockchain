import { Cohort } from "src/cohorts/entities/cohort.entity";
import { Student } from "src/students/entities/student.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => Student, (student) => student.class, {cascade: true})
    students: Student[]
}
