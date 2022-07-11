﻿import {Component, OnDestroy, ViewChild} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {AuthenticationService} from './services/authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {Token} from "./model/user";
import {Subscription} from "rxjs";
import {MModalComponent} from "./shared/components/m-modal/m-modal.component";
import {ToastrService} from "ngx-toastr";


@Component({selector: 'app', styleUrls: ['app.component.scss'], templateUrl: 'app.component.html'})
export class AppComponent implements OnDestroy {
  @ViewChild(MModalComponent)
  private modal;

  collapsed: boolean = true
  token: Token;
  routes = [
    {text: "Home", route: "/home", icon: "home"},
    {text: "Users", route: "/users", icon: "user"},
  ]
  loading: boolean;
  private readonly routerSubx: Subscription;

  constructor(private router: Router,
              private toastr: ToastrService,
              private authenticationService: AuthenticationService,
              translate: TranslateService) {
    this.authenticationService.token.subscribe(x => this.token = x);
    translate.addLangs(['fr']);
    translate.setDefaultLang('fr');
    translate.use('fr');

    this.routerSubx = router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
      }
    });

  }

  addCommande() {
    this.modal.show();
  }

  logout() {
    this.authenticationService.logout();
  }

  ngOnDestroy(): void {
    if (this.routerSubx) {
      this.routerSubx.unsubscribe();
    }
  }
}