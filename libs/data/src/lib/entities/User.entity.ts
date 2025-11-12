import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

// Lazy imports (type-only and runtime)
import type { Organization } from './Organization.entity.js';
import type { Task } from './Task.entity.js';
import { Organization as OrganizationEntity } from './Organization.entity.js';
import { Task as TaskEntity } from './Task.entity.js';

export enum RoleName {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  VIEWER = 'Viewer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  //  Lazy-loaded Organization reference
  @ManyToOne(() => OrganizationEntity, (org: Organization) => org.users, {
    eager: true,
    onDelete: 'CASCADE',
  })
  organization: Organization;

  //  Lazy-loaded Task reference
  @OneToMany(() => TaskEntity, (task: Task) => task.owner)
  tasks: Task[];

  @Column({
    type: 'enum',
    enum: RoleName,
    default: RoleName.VIEWER,
  })
  role: RoleName;

  //  Auto-hash password before saving
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  //  Validate password
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
