import { Module } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { AcademicYearsController } from './academic-years.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicYear } from './entities/academic-year.entity';
import { Cohort } from 'src/cohorts/entities/cohort.entity';
import { Semester } from 'src/semesters/entities/semester.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicYear, Cohort, Semester])],
  controllers: [AcademicYearsController],
  providers: [AcademicYearsService],
  exports: [AcademicYearsService]
})
export class AcademicYearsModule {}
