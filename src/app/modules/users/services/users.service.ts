import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;

  createUser(user: User) {
    let url = this.baseUrl + '/management/users';
    return this.http.post(url, user);
  }

  getAllUsers(PageNumber: number, PageSize: number) {
    let url =
      this.baseUrl +
      `/management/users?PageNumber=${PageNumber}&PageSize=${PageSize}`;
    return this.http.get(url);
  }
  getUserById(userId: string) {
    let url = this.baseUrl + `/management/users/${userId}`;
    return this.http.get(url);
  }
  deleteUser(userId: string) {
    let url = this.baseUrl + `/management/users/${userId}`;
    return this.http.delete(url);
  }
  updateUser(userId: string, user: User) {
    let url = this.baseUrl + `/management/users/${userId}`;
    return this.http.put(url, user);
  }

  activateUser(userId: string) {
    let url = this.baseUrl + `/management/users/${userId}/active-and-deactive`;
    return this.http.patch(url, '');
  }
}
