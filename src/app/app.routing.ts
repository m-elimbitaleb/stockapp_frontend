import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './helpers/auth.guard';
import {LoginComponent} from "./shared/login/login.component";
import {NotFoundComponent} from "./not-found.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {
    path: 'users',
    loadChildren: () => import("./users/users.module").then(value => value.UsersModule),
    canActivate: [AuthGuard]
  },
  {path: 'not-found', component: NotFoundComponent},

  // otherwise redirect to home
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: '**', redirectTo: 'not-found'},
];

export const appRoutingModule = RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' });
