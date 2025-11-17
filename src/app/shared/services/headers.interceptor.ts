import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { GlobalService } from './global.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const globalServ = inject(GlobalService);
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if ((error.status === 401 || error.status === 403) && token) {
        router.navigateByUrl('/login');
        localStorage.clear();
        globalServ.setModal(false);
      }

      return throwError(() => error);
    })
  );
};
