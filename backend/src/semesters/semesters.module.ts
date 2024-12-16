import { Module } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { SemestersController } from './semesters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { StudentSemesterModule } from 'src/student-semester/student-semester.module';

@Module({
  imports: [TypeOrmModule.forFeature([Semester]), StudentSemesterModule],
  controllers: [SemestersController],
  providers: [SemestersService],
  exports: [SemestersService]
})
export class SemestersModule {}
