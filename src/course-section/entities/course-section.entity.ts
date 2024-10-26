import { Course } from "src/courses/entities/course.entity";
import { Semester } from "src/semesters/entities/semester.entity";
import { StudentEnrollment } from "src/student-enrollment/entities/student-enrollment.entity";
import { Teacher } from "src/teachers/entities/teacher.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CourseSection {
    @PrimaryGeneratedColumn()
    course_section_id: number

    @ManyToOne(() => Semester, (semester) => semester.courseSections)
    semester: Semester

    @ManyToOne(() => Course, (course) => course.courseSections)
    course: Course

    @ManyToOne(() => Teacher, (teacher) => teacher.courseSections)
    teacher: Teacher

    @Column()
    course_section_name: string
    
    @Column()
    current_students: number

    @OneToMany(() => StudentEnrollment, (studentEnrollment) => studentEnrollment.courseSection, {cascade: true})
    student_enrollments: StudentEnrollment[]
}
