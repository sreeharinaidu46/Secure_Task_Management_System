import { IsString, IsOptional, MaxLength, IsEnum, ValidateIf } from 'class-validator';
import { TaskStatus, TaskType } from '@secure-task-system/data';

export class CreateTaskDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsEnum(TaskType)
  type: TaskType;

  // ✅ Organization required if type === 'Work'
  @ValidateIf((o) => o.type === TaskType.WORK)
  @IsString()
  organizationId?: string;
}
