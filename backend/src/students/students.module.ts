import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Cohort } from 'src/cohorts/entities/cohort.entity';
import { StudentSemester } from 'src/student-semester/entities/student-semester.entity';
import { AcademicYearsModule } from 'src/academic-years/academic-years.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Class, Cohort, StudentSemester]),
    AcademicYearsModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
