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

@Entity('daily_to_do_lists')
export class DailyToDoListEntity {

  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
    status: string;

  @Column({type:"date", nullable:true})
    completionDate: Date;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => TaskEntity, (task) => task.id, { onDelete: 'CASCADE' })
  task: TaskEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;

}
