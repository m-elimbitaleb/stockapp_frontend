import {Routes} from '@angular/router';
import {NotFoundComponent} from "../not-found.component";
import {ShipmentListComponent} from "./list/shipment.component";


export const routes: Routes = [
  {path: 'list', component: ShipmentListComponent},

  {path: 'not-found', component: NotFoundComponent},

  // otherwise redirect to home
  {path: '', pathMatch: 'full', redirectTo: 'list'},
  {path: '**', redirectTo: 'not-found'},
];

