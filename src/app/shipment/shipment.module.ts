import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {routes} from "./shipment.routing";
import {RbacModule} from "../shared/rbac/rbac.module";
import {AgGridModule} from "ag-grid-angular";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ShipmentListComponent} from "./list/shipment.component";
import {ShipmentFormComponent} from "./shipment-form/shipment-form.component";
import {AgGridActionsButtonsComponent} from "../shared/ag-grid-actions-buttons/ag-grid-actions-buttons.component";


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RbacModule,
    SharedModule,
    AgGridModule.withComponents([AgGridActionsButtonsComponent]),
    ReactiveFormsModule
  ],
  declarations: [ShipmentListComponent, ShipmentFormComponent],
  exports: [ShipmentListComponent],
  providers: [],
})
export class ShipmentModule {
}
