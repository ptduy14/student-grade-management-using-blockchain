import { Module } from '@nestjs/common';
import { CohortsService } from './cohorts.service';
import { CohortsController } from './cohorts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cohort } from './entities/cohort.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cohort])],
  controllers: [CohortsController],
  providers: [CohortsService],
})
export class CohortsModule {}
