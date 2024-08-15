import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskEntity } from './task.entity';
import { TaskRepository } from './task.repository';
import { DailyToDoListModule } from 'src/modules/daily-to-do-list/daily-to-do-list.module';
import { PointsTableModule } from 'src/modules/points-table/points-table.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
    DailyToDoListModule,
    PointsTableModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService],
})
export class TaskModule {}
