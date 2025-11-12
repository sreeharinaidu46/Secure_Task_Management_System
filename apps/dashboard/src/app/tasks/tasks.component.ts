import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  showForm = false;
  newTask: Task = { title: '', type: 'Work', status: 'Todo', description: '' };
  editingTask: Task | null = null;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    this.filteredTasks = this.tasks.filter((t) =>
      t.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  saveTask() {
    if (this.newTask.title.trim()) {
      this.taskService.createTask(this.newTask).subscribe(() => {
        this.newTask = { title: '', type: 'Work', status: 'Todo', description: '' };
        this.showForm = false;
        this.loadTasks();
      });
    }
  }

  deleteTask(taskId?: number) {
    if (!taskId) return;
    this.taskService.deleteTask(taskId).subscribe(() => this.loadTasks());
  }

  editTask(task: Task) {
    this.editingTask = { ...task };
  }

  updateTask() {
    if (!this.editingTask || !this.editingTask.id) return;
    this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe({
      next: () => {
        this.editingTask = null;
        this.loadTasks();
      },
      error: (err) => console.error('Update failed', err),
    });
  }

  cancelEdit() {
    this.editingTask = null;
  }

  drop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.filteredTasks, event.previousIndex, event.currentIndex);
  }

  logout() {
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']); 
  }
}
