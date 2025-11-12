import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { TaskStatus, TaskType } from '@secure-task-system/data';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;
}
