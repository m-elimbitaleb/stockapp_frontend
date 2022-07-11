import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {appRoutingModule} from './app.routing';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {JwtInterceptor} from './helpers/jwt.interceptor';
import {ErrorInterceptor} from './helpers/error.interceptor';
import {InputOnlyNumberDirective} from './shared/input-only-number.directive';
import {AgGridModule} from 'ag-grid-angular';
import {AgGridActionsButtonsComponent} from './shared/ag-grid-actions-buttons/ag-grid-actions-buttons.component';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AlphanumericDirective} from './directive/alphanumeric.directive';
import {ConfirmDialogComponent} from "./shared/confirm-dialog/confirm-dialog.component";
import {ConfirmDialogService} from "./shared/confirm-dialog/confirm-dialog.service";
import {DatePipe} from "@angular/common";
import {LoginComponent} from "./shared/login/login.component";
import {RbacModule} from "./shared/rbac/rbac.module";
import {NotFoundComponent} from "./not-found.component";
import {SharedModule} from "./shared/shared.module";
import {PlyrModule} from "ngx-plyr";


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);

}

@NgModule({
  imports: [
    BrowserModule,
    RbacModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbDropdownModule,
    appRoutingModule,
    FormsModule,
    FontAwesomeModule,
    AgGridModule.withComponents([AgGridActionsButtonsComponent]),
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ), ToastrModule.forRoot(), SharedModule, PlyrModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    InputOnlyNumberDirective,
    AlphanumericDirective,
    AgGridActionsButtonsComponent,
    ConfirmDialogComponent,
    NotFoundComponent
  ],
  exports: [
    TranslateModule,
  ],
  providers: [
    ConfirmDialogService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

}
