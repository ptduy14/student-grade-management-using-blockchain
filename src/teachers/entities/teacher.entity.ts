import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserRoleEnum } from "common/enums/user-role.enum"
import { CourseSection } from "src/course-section/entities/course-section.entity"

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
        enum: UserRoleEnum,
        default: UserRoleEnum.TEACHER,
    })
    teacher_role: UserRoleEnum

    @OneToMany(() => CourseSection, (courseSection) => courseSection.teacher, {cascade: true})
    courseSections: CourseSection[]
}