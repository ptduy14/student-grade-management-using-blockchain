import { Module } from '@nestjs/common';
import { StudentSemesterService } from './student-semester.service';
import { StudentSemesterController } from './student-semester.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentSemester } from './entities/student-semester.entity';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudentSemester]), StudentsModule],
  controllers: [StudentSemesterController],
  providers: [StudentSemesterService],
})
export class StudentSemesterModule {}
