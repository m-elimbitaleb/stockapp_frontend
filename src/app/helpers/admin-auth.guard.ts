import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {RoleEnum} from "../model/user";

@Injectable({providedIn: 'root'})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.authenticationService.tokenValue;
    if (token && this.authenticationService.userHasAnyRole([RoleEnum.ADMIN])) {
      return true;
    }

    this.authenticationService.logout();
    return false;
  }
}
