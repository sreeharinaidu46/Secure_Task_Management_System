import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '@secure-task-system/auth';
import { User } from '@secure-task-system/data';
import { Request as ExpressRequest } from 'express'; // ✅ Import Express type

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * ✅ CREATE TASK
   * POST /api/tasks
   */
  @Post()
  async create(@Body() dto: CreateTaskDto, @Request() req: ExpressRequest) {
    const user = req.user as User;
    return this.tasksService.createTask(dto, user);
  }

  /**
   * ✅ GET ALL TASKS (Personal + Work, Filter by title)
   * GET /api/tasks?title=Finance
   */
  @Get()
  async getAll(
    @Request() req: ExpressRequest,
    @Query('title') title?: string,
  ) {
    const user = req.user as User;
    return this.tasksService.getTasks(user, title);
  }

  /**
   * ✅ UPDATE TASK (only Admin/Owner)
   * PUT /api/tasks/:id
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user as User;
    return this.tasksService.updateTask(id, dto, user);
  }

  /**
   * ✅ DELETE TASK (only Admin/Owner)
   * DELETE /api/tasks/:id
   */
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user as User;
    return this.tasksService.deleteTask(id, user);
  }
}
