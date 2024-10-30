import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
import { CourseSectionModule } from 'src/course-section/course-section.module';
import { StudentEnrollment } from 'src/student-enrollment/entities/student-enrollment.entity';
import { StudentEnrollmentModule } from 'src/student-enrollment/student-enrollment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Score, StudentEnrollment]), CourseSectionModule, StudentEnrollmentModule],
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule {}
