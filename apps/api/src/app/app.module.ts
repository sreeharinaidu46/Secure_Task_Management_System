import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@secure-task-system/auth';
import { DataModule } from '@secure-task-system/data';
import { TasksModule } from './tasks/tasks.module';
import { AuditLoggerService } from './tasks/audit-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'password',
      database: process.env.DATABASE_NAME ?? 'securetask_db',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    DataModule,
    AuthModule,
    TasksModule,
  ],
  providers: [AuditLoggerService],
})
export class AppModule {}
