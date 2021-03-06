import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {routes} from "./inventory.routing";
import {RbacModule} from "../shared/rbac/rbac.module";
import {AgGridModule} from "ag-grid-angular";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {InventoryItemFormComponent} from "./inventory-form/inventory-form.component";
import {InventoryListComponent} from "./list/inventory.component";
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
  declarations: [InventoryListComponent, InventoryItemFormComponent],
  exports: [InventoryListComponent, InventoryItemFormComponent],
  providers: [],
})
export class InventoryModule {
}
