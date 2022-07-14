import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './helpers/auth.guard';
import {LoginComponent} from "./shared/login/login.component";
import {NotFoundComponent} from "./not-found.component";
import {AdminAuthGuard} from "./helpers/admin-auth.guard";
import {InventoryMode} from "./shared/utils/utils";

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {
    path: 'users',
    loadChildren: () => import("./users/users.module").then(value => value.UsersModule),
    canActivate: [AdminAuthGuard]
  }, {
    path: 'inventory',
    data: {mode: InventoryMode.INVENTORY},
    loadChildren: () => import("./inventory/inventory.module").then(value => value.InventoryModule),
    canActivate: [AuthGuard]
  }, {
    path: 'storage',
    data: {mode: InventoryMode.STORAGE},
    loadChildren: () => import("./inventory/inventory.module").then(value => value.InventoryModule),
    canActivate: [AuthGuard]
  }, {
    path: 'shipments',
    loadChildren: () => import("./shipment/shipment.module").then(value => value.ShipmentModule),
    data: {mode: InventoryMode.SHIPMENT},
    canActivate: [AuthGuard]
  }, {
    path: 'cross-dock',
    loadChildren: () => import("./shipment/shipment.module").then(value => value.ShipmentModule),
    data: {mode: InventoryMode.CROSSDOCK},
    canActivate: [AuthGuard]
  }, {
    path: 'warehouses',
    loadChildren: () => import("./warehouse/warehouse.module").then(value => value.WarehouseModule),
    canActivate: [AuthGuard]
  },
  {path: 'not-found', component: NotFoundComponent},

  // otherwise redirect to home
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: '**', redirectTo: 'not-found'},
];

export const appRoutingModule = RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'});
