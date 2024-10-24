import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Cohort } from 'src/cohorts/entities/cohort.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Cohort])],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
