import { Module } from '@nestjs/common';
import { StudentEnrollmentService } from './student-enrollment.service';
import { StudentEnrollmentController } from './student-enrollment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEnrollment } from './entities/student-enrollment.entity';
import { StudentSemesterModule } from 'src/student-semester/student-semester.module';
import { CourseSectionModule } from 'src/course-section/course-section.module';
import { StudentSemester } from 'src/student-semester/entities/student-semester.entity';
import { CoursesModule } from 'src/courses/courses.module';
import { SemestersModule } from 'src/semesters/semesters.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEnrollment, StudentSemester]), StudentSemesterModule, CourseSectionModule, CoursesModule, SemestersModule],
  controllers: [StudentEnrollmentController],
  providers: [StudentEnrollmentService],
})
export class StudentEnrollmentModule {}
