import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Role } from '../models/Role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  URL_PREFIX = 'http://localhost:5000/roles/';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Role[]>(this.URL_PREFIX);
  }
}
