import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsTableService } from './points-table.service';
import { PointsTableController } from './points-table.controller';
import { PointsTableEntity } from './points-table.entity';
import { PointsTableRepository } from './points-table.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PointsTableEntity]),
  ],
  controllers: [PointsTableController],
  providers: [PointsTableService, PointsTableRepository],
  exports: [PointsTableService],
})
export class PointsTableModule {}
