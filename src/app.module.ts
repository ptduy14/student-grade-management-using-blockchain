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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
