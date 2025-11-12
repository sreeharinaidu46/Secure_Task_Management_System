import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Lazy imports (type-only and runtime)
import type { Organization } from './Organization.entity.js';
import type { User } from './User.entity.js';
import { Organization as OrganizationEntity } from './Organization.entity.js';
import { User as UserEntity } from './User.entity.js';

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In-Progress',
  IN_TEST = 'In-Test',
  DONE = 'Done',
}

export enum TaskType {
  WORK = 'Work',
  PERSONAL = 'Personal',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.PERSONAL,
  })
  type: TaskType;

  //  Lazy-loaded User reference
  @ManyToOne(() => UserEntity, (user: User) => user.tasks, {
    eager: true,
    onDelete: 'CASCADE',
  })
  owner: User;

  //  Lazy-loaded Organization reference
  @ManyToOne(() => OrganizationEntity, (org: Organization) => org.tasks, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  organization?: Organization;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
