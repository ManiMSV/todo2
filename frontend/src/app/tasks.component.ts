import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TaskService, Task, TaskCreate } from './task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="header">
      <h1>TaskFlow</h1>
      <button (click)="logout()">Logout</button>
    </div>
    <div class="container">
      <div class="card">
        <h2>Create New Task</h2>
        <form (ngSubmit)="createTask()">
          <div class="form-group">
            <label>Title</label>
            <input type="text" [(ngModel)]="newTask.title" name="title" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="newTask.description" name="description"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Priority</label>
              <select [(ngModel)]="newTask.priority" name="priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div class="form-group">
              <label>Category</label>
              <input type="text" [(ngModel)]="newTask.category" name="category" />
            </div>
          </div>
          <button type="submit" class="btn-primary">Add Task</button>
        </form>
      </div>

      <div class="card">
        <h2>My Tasks</h2>
        <div class="filters">
          <label>Status:</label>
          <select [(ngModel)]="statusFilter" (change)="loadTasks()">
            <option value="">All</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <label>Priority:</label>
          <select [(ngModel)]="priorityFilter" (change)="loadTasks()">
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div *ngIf="tasks.length === 0" class="empty">No tasks found</div>
        <div *ngFor="let task of tasks" class="task-item" [class.done]="task.status === 'done'">
          <div class="task-header">
            <h3>{{ task.title }}</h3>
            <span class="priority" [class.high]="task.priority === 'high'" [class.medium]="task.priority === 'medium'">{{ task.priority }}</span>
          </div>
          <p *ngIf="task.description">{{ task.description }}</p>
          <div class="task-footer">
            <span class="status">{{ task.status | titlecase }}</span>
            <div class="task-actions">
              <button (click)="changeStatus(task)" class="btn-small">Next Status</button>
              <button (click)="deleteTask(task.id)" class="btn-small danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header { background: #007bff; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
    .header button { background: white; color: #007bff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    .container { max-width: 800px; margin: 24px auto; padding: 0 16px; }
    .card { background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 24px; }
    h2 { margin-bottom: 16px; }
    .form-group { margin-bottom: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    label { display: block; margin-bottom: 8px; font-weight: 500; }
    input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    textarea { min-height: 80px; }
    .btn-primary { background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; }
    .filters { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; }
    .filters label { margin-bottom: 0; font-size: 14px; }
    .filters select { width: auto; }
    .empty { text-align: center; color: #999; padding: 24px; }
    .task-item { border: 1px solid #eee; padding: 16px; border-radius: 4px; margin-bottom: 12px; }
    .task-item.done { opacity: 0.6; }
    .task-header { display: flex; justify-content: space-between; align-items: start; }
    h3 { margin: 0 0 8px 0; }
    p { margin: 8px 0; color: #666; }
    .priority { background: #ddd; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .priority.high { background: #dc3545; color: white; }
    .priority.medium { background: #ffc107; }
    .task-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
    .status { font-size: 14px; color: #007bff; font-weight: 500; }
    .task-actions { display: flex; gap: 8px; }
    .btn-small { background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; }
    .btn-small.danger { background: #dc3545; }
  `]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  statusFilter = '';
  priorityFilter = '';
  newTask: TaskCreate = { title: '', description: '', priority: 'medium', category: '' };

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const filters: any = {};
    if (this.statusFilter) filters.status_filter = this.statusFilter;
    if (this.priorityFilter) filters.priority = this.priorityFilter;

    this.taskService.getTasks(filters).subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load tasks', err);
      }
    });
  }

  createTask(): void {
    if (!this.newTask.title) return;
    this.taskService.createTask(this.newTask).subscribe({
      next: () => {
        this.newTask = { title: '', description: '', priority: 'medium', category: '' };
        this.loadTasks();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to create task', err);
      }
    });
  }

  changeStatus(task: Task): void {
    let newStatus: 'todo' | 'in_progress' | 'done' = 'todo';
    if (task.status === 'todo') newStatus = 'in_progress';
    else if (task.status === 'in_progress') newStatus = 'done';

    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to update task', err);
      }
    });
  }

  deleteTask(id: string): void {
    if (!confirm('Delete this task?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to delete task', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
