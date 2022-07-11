import {Routes} from '@angular/router';
import {NotFoundComponent} from "../not-found.component";
import {UserComponent} from "./list/user.component";


export const routes: Routes = [
  {path: 'list', component: UserComponent},

  {path: 'not-found', component: NotFoundComponent},

  // otherwise redirect to home
  {path: '', pathMatch: 'full', redirectTo: 'list'},
  {path: '**', redirectTo: 'not-found'},
];

