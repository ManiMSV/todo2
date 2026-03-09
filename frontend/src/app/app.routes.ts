import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { TasksComponent } from './tasks.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
