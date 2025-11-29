import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from '../models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  URL_PREFIX = environment.apiUrl + '/user/';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const body = new URLSearchParams();
    body.set('email', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(this.URL_PREFIX + 'login', body, {
      headers: headers,
      withCredentials: true,
    });
  }

  register(user: User) {
    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('password', user.password);
    body.set('firstName', user.firstName);
    body.set('lastName', user.lastName);
    body.set('role', user.role);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(this.URL_PREFIX + 'signup', body, {
      headers: headers,
    });
  }

  logout() {
    return this.http.post(
      this.URL_PREFIX + 'logout',
      {},
      { withCredentials: true, responseType: 'text' }
    );
  }

  checkAuth() {
    return this.http.get<boolean>(this.URL_PREFIX + 'is-authenticated', {
      withCredentials: true,
    });
  }
}
