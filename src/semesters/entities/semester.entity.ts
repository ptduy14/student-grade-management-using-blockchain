import { SemesterNameEnum } from "common/enums/semester-name.enum";
import { AcademicYear } from "src/academic-years/entities/academic-year.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Semester {
    @PrimaryGeneratedColumn()
    semester_id: number

    @Column()
    semester_name: SemesterNameEnum

    @ManyToOne(() => AcademicYear, (academicYear) => academicYear.semesters)
    academic_year: AcademicYear
}
