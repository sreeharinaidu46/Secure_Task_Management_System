import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { TaskService } from './task.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

describe('TasksComponent (Jest)', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let mockTaskService: jest.Mocked<TaskService>;

  const mockTasks = [
    { id: 1, title: 'Task 1', description: 'Desc 1', type: 'Work', status: 'Todo' },
    { id: 2, title: 'Task 2', description: 'Desc 2', type: 'Personal', status: 'In-Progress' },
  ];

  beforeEach(async () => {
    // ✅ Jest mock for TaskService
    const serviceMock: jest.Mocked<TaskService> = {
      getTasks: jest.fn().mockReturnValue(of(mockTasks)),
      createTask: jest.fn().mockReturnValue(of({ id: 3, title: 'New Task', type: 'Work', status: 'Todo' })),
      deleteTask: jest.fn().mockReturnValue(of(void 0)),
      updateTask: jest.fn().mockReturnValue(of({ id: 1, title: 'Updated Task', type: 'Work', status: 'Done' })),
    } as any;

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, DragDropModule, TasksComponent],
      providers: [{ provide: TaskService, useValue: serviceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    mockTaskService = TestBed.inject(TaskService) as jest.Mocked<TaskService>;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(component.tasks.length).toBe(2);
    expect(mockTaskService.getTasks).toHaveBeenCalled();
  });

  it('should create a new task', () => {
    component.newTask = { title: 'New Task', type: 'Work', status: 'Todo', description: 'Test' };
    component.saveTask();
    expect(mockTaskService.createTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Task',
        type: 'Work',
        status: 'Todo',
      }),
    );
  });

  it('should delete a task', () => {
    component.deleteTask(1);
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
  });

  it('should update a task', () => {
    component.editingTask = {
      id: 1,
      title: 'Updated Task',
      type: 'Work',
      status: 'Done',
      description: 'Edited',
    };
    component.updateTask();

    expect(mockTaskService.updateTask).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        id: 1,
        title: 'Updated Task',
        type: 'Work',
        status: 'Done',
        description: 'Edited',
      }),
    );
  });
});
