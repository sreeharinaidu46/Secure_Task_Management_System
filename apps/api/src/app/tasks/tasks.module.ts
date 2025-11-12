import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task, User } from '@secure-task-system/data';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuditLoggerService } from './audit-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])], // ✅ include User here
  controllers: [TasksController],
  providers: [TasksService, AuditLoggerService],
})
export class TasksModule {}
