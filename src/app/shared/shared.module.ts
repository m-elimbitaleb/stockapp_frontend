import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "./components/header.component";
import {MModalComponent} from "./components/m-modal/m-modal.component";
import {MConfirmModal} from "./components/m-confirm-modal";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgxIntlTelInputModule
  ],
  declarations: [HeaderComponent, MModalComponent, MConfirmModal],
  exports: [HeaderComponent, MModalComponent, MConfirmModal],
})
export class SharedModule {
}
