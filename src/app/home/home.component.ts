import {Component} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {Token} from "../model/user";


@Component({templateUrl: 'home.component.html'})
export class HomeComponent {
  token: Token;
  users: any[] = [];

  constructor(private authenticationService: AuthenticationService) {
    this.token = this.authenticationService.tokenValue;
  }
}
