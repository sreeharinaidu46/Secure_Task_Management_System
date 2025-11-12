import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // 🔹 Get all tasks for current user/org
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, { headers: this.headers() });
  }

  // 🔹 Create a new task
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, { headers: this.headers() });
  }

  // 🔹 Update existing task
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, {
      headers: this.headers(),
    });
  }

  // 🔹 Delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers() });
  }
}
