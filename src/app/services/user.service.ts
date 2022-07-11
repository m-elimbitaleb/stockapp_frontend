import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Token, User} from "../model/user";


@Injectable({providedIn: 'root'})
export class UserService {
  private apiUrl = `${environment.backendPrefix}/api/v1/user`;

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get(`${this.apiUrl}`);
  }

  save(user: User) {
    return this.http.post(`${this.apiUrl}`, user);
  }

  disableUser(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  enableUser(id) {
    return this.http.put(`${this.apiUrl}/activate/${id}`, {});
  }
}
