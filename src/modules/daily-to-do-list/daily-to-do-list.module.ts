import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyToDoListService } from './daily-to-do-list.service';
import { DailyToDoListController } from './daily-to-do-list.controller';
import { DailyToDoListEntity } from './daily-to-do-list.entity';
import { DailyToDoListRepository } from './daily-to-do-list.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyToDoListEntity]),
  ],
  controllers: [DailyToDoListController],
  providers: [DailyToDoListService, DailyToDoListRepository],
  exports: [DailyToDoListService],
})
export class DailyToDoListModule {}
