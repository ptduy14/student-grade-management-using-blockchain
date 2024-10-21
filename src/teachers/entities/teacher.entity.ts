import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { TeacherRoleEnum } from "common/enums/teacher-role.enum"

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn()
    teacher_id: number

    @Column()
    teacher_name: string

    @Column()
    teacher_email: string

    @Column()
    teacher_password: string

    @Column({
        type: "enum",
        enum: TeacherRoleEnum,
        default: TeacherRoleEnum.TEACHER,
    })
    teacher_role: TeacherRoleEnum
}