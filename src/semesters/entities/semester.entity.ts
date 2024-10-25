import { SemesterNameEnum } from "common/enums/semester-name.enum";
import { AcademicYear } from "src/academic-years/entities/academic-year.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { StudentSemester } from "src/student-semester/entities/student-semester.entity";
import { SemesterStatusEnum } from "common/enums/semester-status.enum";
import { CourseSection } from "src/course-section/entities/course-section.entity";

@Entity()
export class Semester {
    @PrimaryGeneratedColumn()
    semester_id: number

    @Column({type: 'enum', enum: SemesterStatusEnum, default: SemesterStatusEnum.NOT_STARTED})
    semester_status: SemesterStatusEnum

    @ManyToOne(() => AcademicYear, (academicYear) => academicYear.semesters)
    academic_year: AcademicYear

    @OneToMany(() => StudentSemester, studentSemester => studentSemester.semester, {cascade: true})
    studentSemesters: StudentSemester[];

    @OneToMany(() => CourseSection, (courseSection) => courseSection.semester, {cascade: true})
    courseSections: CourseSection[]
}
