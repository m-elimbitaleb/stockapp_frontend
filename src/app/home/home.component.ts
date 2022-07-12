import {Component} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {RoleEnum, Token} from "../model/user";
import {Router} from "@angular/router";


@Component({template: ''})
export class HomeComponent {

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
    const userIsAdmin = this.authenticationService.userHasAnyRole([RoleEnum.ADMIN]);
    const redirectPath = userIsAdmin ? "warehouses" : "inventory"
    this.router.navigate([redirectPath])
  }
}
