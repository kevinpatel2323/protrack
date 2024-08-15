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

@Entity('progress_trackers')
export class ProgressTrackerEntity {

  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
    totalPoints: number;

  @Column({type:"decimal", precision:10, scale:2, nullable:true})
    completionPercentage: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;

}
