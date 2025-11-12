import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { RoleName, TaskType } from '@secure-task-system/data';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockUser = {
    id: 1,
    email: 'owner@techmahindra.com',
    role: RoleName.OWNER,
    organization: { id: 1, name: 'Tech Mahindra' },
  };

  const mockTasks = [
    { id: 1, title: 'Task 1', type: TaskType.WORK },
    { id: 2, title: 'Task 2', type: TaskType.PERSONAL },
  ];

  const mockService = {
    createTask: jest.fn().mockResolvedValue(mockTasks[0]),
    getTasks: jest.fn().mockResolvedValue(mockTasks),
    updateTask: jest.fn().mockResolvedValue({ ...mockTasks[0], title: 'Updated Task' }),
    deleteTask: jest.fn().mockResolvedValue({ message: 'Task deleted successfully' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    const dto = { title: 'Task 1', type: TaskType.WORK };
    const result = await controller.create(dto, { user: mockUser } as any);
    expect(result.title).toBe('Task 1');
    expect(service.createTask).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should get all tasks', async () => {
    const result = await controller.getAll({ user: mockUser } as any);
    expect(result).toHaveLength(2);
    expect(service.getTasks).toHaveBeenCalled();
  });

  it('should update a task', async () => {
    const dto = { title: 'Updated Task' };
    const result = await controller.update(1, dto, { user: mockUser } as any);
    expect(result.title).toBe('Updated Task');
    expect(service.updateTask).toHaveBeenCalledWith(1, dto, mockUser);
  });

  it('should delete a task', async () => {
    const result = await controller.delete(1, { user: mockUser } as any);
    expect(result.message).toBe('Task deleted successfully');
    expect(service.deleteTask).toHaveBeenCalledWith(1, mockUser);
  });
});
