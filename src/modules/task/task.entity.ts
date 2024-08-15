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

import { UserEntity } from '../user/user.entity'

@Entity('tasks')
export class TaskEntity {

  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
    taskName: string;

  @Column()
    points: number;

  @Column({type:"datetime", nullable:true})
    dateCreated: Date;

  @Column({type:"datetime", nullable:true})
    dateUpdated: Date;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;

}
