import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity.js';
import { Organization } from './entities/Organization.entity.js';
import { Task } from './entities/Task.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, Task])],
  exports: [TypeOrmModule],
})
export class DataModule {}
