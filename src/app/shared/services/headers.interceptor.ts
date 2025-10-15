import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if ((error.status === 401 || error.status === 403) && token) {
        localStorage.clear();
        router.navigate(['/login']);

        // authServ.refreshToken().subscribe({
        //   error: () => {
        //     router.navigate(['/error']);
        //   },
        // });
      }

      return throwError(() => error);
    })
  );
};
