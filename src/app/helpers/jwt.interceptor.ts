import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let token = this.authenticationService.tokenValue;
    request = request.clone({
      setHeaders: {
        'X-app-id': 'stockapp-admin'
      }
    })
    if (token && token.authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.authToken}`
        }
      });
    }

    return next.handle(request);
  }
}
