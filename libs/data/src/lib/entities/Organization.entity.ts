import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { User } from './User.entity.js';
import type { Task } from './Task.entity.js';
import { User as UserEntity } from './User.entity.js';
import { Task as TaskEntity } from './Task.entity.js';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  //  Parent → Child relation (self-join)
  @ManyToOne(() => Organization, (org) => org.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: Organization;

  @OneToMany(() => Organization, (org) => org.parent)
  children: Organization[];

  //  Use direct entity class references (lazy via function)
  @OneToMany(() => UserEntity, (user: User) => user.organization)
  users: User[];

  @OneToMany(() => TaskEntity, (task: Task) => task.organization)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
