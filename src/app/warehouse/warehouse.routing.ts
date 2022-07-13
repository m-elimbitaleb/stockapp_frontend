import {Routes} from '@angular/router';
import {NotFoundComponent} from "../not-found.component";
import {WarehouseListComponent} from "./list/warehouse.component";


export const routes: Routes = [
  {path: 'list', component: WarehouseListComponent},

  {path: 'not-found', component: NotFoundComponent},

  // otherwise redirect to home
  {path: '', pathMatch: 'full', redirectTo: 'list'},
  {path: '**', redirectTo: 'not-found'},
];

