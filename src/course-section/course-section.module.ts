import { Module } from '@nestjs/common';
import { CourseSectionService } from './course-section.service';
import { CourseSectionController } from './course-section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseSection } from './entities/course-section.entity';
import { SemestersModule } from 'src/semesters/semesters.module';
import { CoursesModule } from 'src/courses/courses.module';
import { TeachersModule } from 'src/teachers/teachers.module';

@Module({
  imports: [TypeOrmModule.forFeature([CourseSection]), SemestersModule, CoursesModule, TeachersModule],
  controllers: [CourseSectionController],
  providers: [CourseSectionService],
})
export class CourseSectionModule {}
