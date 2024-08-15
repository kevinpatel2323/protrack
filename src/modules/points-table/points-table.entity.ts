import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne, 
  OneToMany, 
  ManyToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';

import { TaskEntity } from '../task/task.entity'
import { UserEntity } from '../user/user.entity'

@Entity('points_tables')
export class PointsTableEntity {

  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => TaskEntity, (task) => task.id, { onDelete: 'CASCADE' })
  task: TaskEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;

}
