import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  category?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  due_date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(filters?: {
    status_filter?: string;
    priority?: string;
    category?: string;
    sort_by?: string;
    order?: string;
  }): Observable<Task[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    return this.http.get<Task[]>(this.baseUrl, { params });
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  createTask(task: TaskCreate): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  updateTask(id: string, task: TaskUpdate): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
