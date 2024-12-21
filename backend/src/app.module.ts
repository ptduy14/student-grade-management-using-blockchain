import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TeachersModule } from './teachers/teachers.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { SemestersModule } from './semesters/semesters.module';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { ClassesModule } from './classes/classes.module';
import { CohortsModule } from './cohorts/cohorts.module';
import { StudentsModule } from './students/students.module';
import { StudentSemesterModule } from './student-semester/student-semester.module';
import { CourseSectionModule } from './course-section/course-section.module';
import { StudentEnrollmentModule } from './student-enrollment/student-enrollment.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { ScoresModule } from './scores/scores.module';
import { TransactionHistoryModule } from './transaction-history/transaction-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TeachersModule,
    AuthModule,
    CoursesModule,
    SemestersModule,
    AcademicYearsModule,
    ClassesModule,
    CohortsModule,
    StudentsModule,
    StudentSemesterModule,
    CourseSectionModule,
    StudentEnrollmentModule,
    BlockchainModule,
    ScoresModule,
    TransactionHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
