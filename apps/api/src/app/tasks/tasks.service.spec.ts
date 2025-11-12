import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, User, RoleName, TaskType } from '@secure-task-system/data';
import { AuditLoggerService } from './audit-logger.service';

describe('TasksService', () => {
  let service: TasksService;
  let mockTaskRepo: Partial<Repository<Task>>;
  let mockUserRepo: Partial<Repository<User>>;
  let mockAudit: Partial<AuditLoggerService>;

  beforeEach(async () => {
    mockTaskRepo = {
      find: jest.fn().mockResolvedValue([
        {
          id: 1,
          title: 'Mock Task',
          description: 'Test Description',
          type: TaskType.WORK,
          status: 'Todo',
          organization: { id: 1, name: 'Tech Mahindra' },
          owner: { id: 1, email: 'owner@techmahindra.com' },
        },
      ]),
      findOne: jest.fn().mockResolvedValue({
        id: 10,
        title: 'Deletable Task',
        type: TaskType.WORK,
        owner: { id: 1, email: 'owner@techmahindra.com' },
        organization: { id: 1, name: 'Tech Mahindra' },
      }),
      create: jest.fn().mockImplementation((task) => task),
      save: jest.fn().mockImplementation((task) => Promise.resolve({ id: 99, ...task })),
      remove: jest.fn().mockResolvedValue({}),
    };

    mockUserRepo = {
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        email: 'owner@techmahindra.com',
        role: RoleName.OWNER,
        organization: { id: 1, name: 'Tech Mahindra' },
      }),
    };

    mockAudit = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockTaskRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: AuditLoggerService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return tasks for a user', async () => {
    const user = {
      id: 1,
      role: RoleName.OWNER,
      organization: { id: 1 },
    } as User;

    const tasks = await service.getTasks(user);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Mock Task');
  });

  it('should create a new work task', async () => {
    const user = {
      id: 1,
      role: RoleName.OWNER,
      organization: { id: 1, name: 'Tech Mahindra' },
    } as User;

    const newTask = {
      title: 'Prepare Report',
      description: 'Finance summary Q4',
      type: TaskType.WORK,
      status: 'Todo',
    } as Partial<Task>;

    const result = await service.createTask(newTask, user);
    expect(result).toHaveProperty('id');
    expect(result.title).toBe('Prepare Report');
    expect(mockAudit.log).toHaveBeenCalled();
  });

  it('should delete a work task as admin/owner', async () => {
    const user = {
      id: 1,
      role: RoleName.OWNER,
      organization: { id: 1, name: 'Tech Mahindra' },
    } as User;

    const result = await service.deleteTask(10, user);
    expect(result).toEqual({ message: 'Task deleted successfully' });
    expect(mockAudit.log).toHaveBeenCalled();
  });
});
