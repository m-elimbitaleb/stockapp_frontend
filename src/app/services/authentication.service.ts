

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Token} from "../model/user";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public token: Observable<Token>;
  private tokenSubject: BehaviorSubject<Token>;

  constructor(private http: HttpClient,
              private router: Router) {
    this.tokenSubject = new BehaviorSubject<Token>(
      JSON.parse(localStorage.getItem('token'))
    );
    this.token = this.tokenSubject.asObservable();
  }

  public get tokenValue(): Token {
    return this.tokenSubject.value;
  }

  public isConnectedUser(id: number) {
    return this.tokenValue.user.id == id;
  }

  login(username, password) {
    return this.http
      .post<any>(`${environment.backendPrefix}/auth/token`, {
        username,
        password,
      })
      .pipe(
        map((token) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', JSON.stringify(token));
          this.tokenSubject.next(token);
          return token;
        })
      );
  }

  register(user) {
    return this.http.post(`${environment.backendPrefix}/auth/register`, user);
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  userHasAnyRole(roles: string[]) {
    if (roles && roles.length == 0) {
      return true;
    }
    if (!roles || roles.length == 0) {
      return false;
    }
    if (this.tokenValue.authenticated &&
      this.tokenValue.user &&
      this.tokenValue.user.permissions) {

      for (let i in roles) {
        const role = roles[i].toUpperCase();
        if (role.startsWith("!")) {
          if (this.tokenValue.user.permissions.includes(role)) {
            return false;
          }
        } else {
          if (this.tokenValue.user.permissions.includes(role)) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
