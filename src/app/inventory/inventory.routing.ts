import {Routes} from '@angular/router';
import {NotFoundComponent} from "../not-found.component";
import {InventoryListComponent} from "./list/inventory.component";


export const routes: Routes = [
  {path: 'list', component: InventoryListComponent},

  {path: 'not-found', component: NotFoundComponent},

  // otherwise redirect to home
  {path: '', pathMatch: 'full', redirectTo: 'list'},
  {path: '**', redirectTo: 'not-found'},
];

