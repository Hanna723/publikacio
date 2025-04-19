import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  URL_PREFIX = 'http://localhost:5000/user/';

  constructor(private http: HttpClient) {}

  getUser() {
    return this.http.get<User>(this.URL_PREFIX, {
      withCredentials: true,
    });
  }

  getUserById(userId: string) {
    return this.http.get<User>(this.URL_PREFIX + userId, {
      withCredentials: true,
    });
  }

  getReviewers() {
    return this.http.get<User[]>(this.URL_PREFIX + 'reviewers', {
      withCredentials: true,
    });
  }

  deleteUser() {
    return this.http.delete(this.URL_PREFIX, { withCredentials: true });
  }

  updateUserName(firstName: string, lastName: string) {
    const body = new URLSearchParams();
    body.set('firstName', firstName);
    body.set('lastName', lastName);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(this.URL_PREFIX + 'update', body, {
      headers: headers,
      withCredentials: true,
    });
  }

  updatePassword(oldPassword: string, newPassword: string) {
    const body = new URLSearchParams();
    body.set('password', oldPassword);
    body.set('newPassword', newPassword);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(this.URL_PREFIX + 'update-password', body, {
      headers: headers,
      withCredentials: true,
    });
  }
}
