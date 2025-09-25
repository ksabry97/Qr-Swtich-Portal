import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './modules/authentication/pages/login/login';
import { AuthGuard } from './shared/services/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [AuthGuard],
    children: [],
  },
  {
    path: 'login',
    component: Login,
  },
];
