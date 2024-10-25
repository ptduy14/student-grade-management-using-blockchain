import { Class } from "src/classes/entities/class.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { StudentSemester } from "src/student-semester/entities/student-semester.entity";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    student_id: number

    @Column({unique: true})
    student_code: string
    
    @Column()
    student_name: string

    @Column()
    student_email: string

    @Column()
    student_password: string

    @Column()
    student_phone: string

    @Column()
    student_address: string

    @ManyToOne(() => Class, (cls) => cls.students)
    class: Class

    @OneToMany(() => StudentSemester, studentSemester => studentSemester.student, {cascade: true})
    studentSemesters: StudentSemester[];
}
