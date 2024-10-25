import { CourseSection } from "src/course-section/entities/course-section.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    course_id: number

    @Column()
    course_code: string;

    @Column()
    course_name: string
    
    @Column()
    course_credits: number

    @Column()
    course_des: string

    @OneToMany(() => CourseSection, (courseSection) => courseSection.course, {cascade: true})
    courseSections: CourseSection[]
}
