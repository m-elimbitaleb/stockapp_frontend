import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RbacDirective} from "./rbac.directive";
import {AuthenticationService} from "../../services/authentication.service";


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RbacDirective,
  ],
  exports: [
    RbacDirective
  ],
  providers: [
    RbacDirective,
    AuthenticationService
  ],
})
export class RbacModule {
}
