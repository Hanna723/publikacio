import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { noAuthGuard } from './shared/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth/login/login.component').then(
            (c) => c.LoginComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./components/auth/signup/signup.component').then(
            (c) => c.SignupComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: 'article',
    canActivate: [authGuard],
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('./components/article/list/list.component').then(
            (c) => c.ListComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./components/article/edit/edit.component').then(
            (c) => c.EditComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./components/article/detail/detail.component').then(
            (c) => c.DetailComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./components/article/edit/edit.component').then(
            (c) => c.EditComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'list',
      },
    ],
  },
  {
    path: 'user',
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/user/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
    ],
  },
  {
    path: 'review',
    canActivate: [authGuard],
    children: [
      {
        path: 'new/:id',
        loadComponent: () =>
          import('./components/review/edit/edit.component').then(
            (c) => c.EditComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./components/review/detail/detail.component').then(
            (c) => c.DetailComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./components/review/edit/edit.component').then(
            (c) => c.EditComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'list',
      },
    ],
  },
  { path: '**', redirectTo: '/auth/login' },
];
