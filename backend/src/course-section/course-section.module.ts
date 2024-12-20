import { Module } from '@nestjs/common';
import { CourseSectionService } from './course-section.service';
import { CourseSectionController } from './course-section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseSection } from './entities/course-section.entity';
import { SemestersModule } from 'src/semesters/semesters.module';
import { CoursesModule } from 'src/courses/courses.module';
import { TeachersModule } from 'src/teachers/teachers.module';
import { StudentEnrollment } from 'src/student-enrollment/entities/student-enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseSection, StudentEnrollment]), SemestersModule, CoursesModule, TeachersModule],
  controllers: [CourseSectionController],
  providers: [CourseSectionService],
  exports: [CourseSectionService]
})
export class CourseSectionModule {}
