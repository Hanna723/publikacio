import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Role } from '../models/Role';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  URL_PREFIX = environment.apiUrl + '/roles/';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Role[]>(this.URL_PREFIX);
  }
}
