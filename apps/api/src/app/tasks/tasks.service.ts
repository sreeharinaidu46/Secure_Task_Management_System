import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, User, RoleName, TaskType } from '@secure-task-system/data';
import { AuditLoggerService } from './audit-logger.service.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly audit: AuditLoggerService,
  ) {}

  // 🔹 CREATE Task
  async createTask(
    data: Partial<Task>,
    user: User,
    context?: { method?: string; url?: string },
  ) {
    if (user.role === RoleName.VIEWER)
      throw new ForbiddenException('Viewers cannot create tasks');

    // Reload full user entity with organization relation
    const fullUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['organization'],
    });

    if (!fullUser)
      throw new ForbiddenException('User not found while creating task');

    if (data.type === TaskType.WORK && !fullUser.organization)
      throw new ForbiddenException('Work tasks must belong to an organization');

    const newTask = this.taskRepo.create({
      ...data,
      owner: fullUser,
      organization:
        data.type === TaskType.WORK ? fullUser.organization : undefined,
    });

    const saved = await this.taskRepo.save(newTask);

    this.audit.log(
      fullUser,
      `Created task "${saved.title}"`,
      context?.method,
      context?.url,
      data,
    );

    return saved;
  }

  //  GET ALL TASKS (Personal + Work)
  async getTasks(user: User, filter?: string) {
    // Reload full user entity with organization relation
    const fullUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['organization'],
    });

    if (!fullUser) throw new ForbiddenException('User not found');

    let tasks = await this.taskRepo.find({
      relations: ['owner', 'organization'],
    });

    // Filter tasks visible to the user
    tasks = tasks.filter((task) => {
      if (task.type === TaskType.PERSONAL) {
        return task.owner.id === fullUser.id;
      }
      if (task.type === TaskType.WORK) {
        return task.organization?.id === fullUser.organization?.id;
      }
      return false;
    });

    // Optional title filter
    if (filter) {
      tasks = tasks.filter((t) =>
        t.title.toLowerCase().includes(filter.toLowerCase()),
      );
    }

    this.audit.log(fullUser, 'Viewed all tasks', 'GET', '/api/tasks');
    return tasks;
  }

  // UPDATE Task (Admin/Owner only for Work tasks)
  async updateTask(id: number, updates: Partial<Task>, user: User) {
    // Reload full user entity
    const fullUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['organization'],
    });

    if (!fullUser) throw new ForbiddenException('User not found');

    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['owner', 'organization'],
    });

    if (!task) throw new NotFoundException('Task not found');

    const isOwner = task.owner.id === fullUser.id;
    const isAdminOrOwner = [RoleName.ADMIN, RoleName.OWNER].includes(fullUser.role);

    //  Prevent cross-organization updates
    if (
      task.type === TaskType.WORK &&
      task.organization &&
      fullUser.organization &&
      task.organization.id !== fullUser.organization.id
    ) {
      throw new ForbiddenException(
        'You cannot update tasks from another organization',
      );
    }

    // Viewers cannot update anything
    if (fullUser.role === RoleName.VIEWER)
      throw new ForbiddenException('Viewers cannot update tasks');

    // Personal: only the owner can update
    if (task.type === TaskType.PERSONAL) {
      if (!isOwner)
        throw new ForbiddenException('You cannot update this personal task');
      Object.assign(task, updates);
    }

    // Work: only Admin/Owner/Task Owner, and only status & description editable
    if (task.type === TaskType.WORK) {
      if (!(isAdminOrOwner || isOwner))
        throw new ForbiddenException('You cannot update this work task');

      const allowedFields = ['status', 'description'];
      const restricted = Object.keys(updates).filter(
        (key) => !allowedFields.includes(key),
      );
      if (restricted.length > 0)
        throw new ForbiddenException(
          `Only ${allowedFields.join(', ')} can be updated for work tasks`,
        );

      Object.assign(task, updates);
    }

    const saved = await this.taskRepo.save(task);
    this.audit.log(
      fullUser,
      `Updated task "${task.title}"`,
      'PUT',
      `/api/tasks/${id}`,
    );
    return saved;
  }

  //  DELETE Task (Admin/Owner only for Work tasks)
  async deleteTask(id: number, user: User) {
    // Reload full user entity
    const fullUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['organization'],
    });

    if (!fullUser) throw new ForbiddenException('User not found');

    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['owner', 'organization'],
    });

    if (!task) throw new NotFoundException('Task not found');

    const isOwner = task.owner.id === fullUser.id;
    const isAdminOrOwner = [RoleName.ADMIN, RoleName.OWNER].includes(fullUser.role);

    // Prevent cross-organization deletes
    if (
      task.type === TaskType.WORK &&
      task.organization &&
      fullUser.organization &&
      task.organization.id !== fullUser.organization.id
    ) {
      throw new ForbiddenException(
        'You cannot delete tasks from another organization',
      );
    }

    // Personal: only the owner can delete
    if (task.type === TaskType.PERSONAL && !isOwner)
      throw new ForbiddenException('You cannot delete this personal task');

    // Work: only Admin/Owner can delete
    if (task.type === TaskType.WORK && !isAdminOrOwner)
      throw new ForbiddenException('You cannot delete this work task');

    await this.taskRepo.remove(task);
    this.audit.log(
      fullUser,
      `Deleted task "${task.title}"`,
      'DELETE',
      `/api/tasks/${id}`,
    );
    return { message: 'Task deleted successfully' };
  }
}
