import { inject, Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  globalServ = inject(GlobalService);
  usersPermission = this.globalServ.usersPermission;

  hasPermission(permission: string) {
    return this.globalServ.usersPermission.subscribe((value) => {
      return value.includes(permission);
    });
  }
}
