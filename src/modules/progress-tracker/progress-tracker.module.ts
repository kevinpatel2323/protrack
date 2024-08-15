import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressTrackerService } from './progress-tracker.service';
import { ProgressTrackerController } from './progress-tracker.controller';
import { ProgressTrackerEntity } from './progress-tracker.entity';
import { ProgressTrackerRepository } from './progress-tracker.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgressTrackerEntity]),
  ],
  controllers: [ProgressTrackerController],
  providers: [ProgressTrackerService, ProgressTrackerRepository],
  exports: [ProgressTrackerService],
})
export class ProgressTrackerModule {}
