import { Class } from "src/classes/entities/class.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { StudentSemester } from "src/student-semester/entities/student-semester.entity";
import { UserRoleEnum } from "common/enums/user-role.enum";

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
    
    @Column({
        type: "enum",
        enum: UserRoleEnum,
        default: UserRoleEnum.STUDENT,
    })
    student_role: UserRoleEnum

    @ManyToOne(() => Class, (cls) => cls.students)
    class: Class

    @OneToMany(() => StudentSemester, studentSemester => studentSemester.student, {cascade: true})
    studentSemesters: StudentSemester[];
}
