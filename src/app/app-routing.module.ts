import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { UsersComponent } from './modules/users/components/users/users.component'
import { EditUserComponent } from './modules/users/components/edit-user/edit-user.component'
import { SettingsComponent } from './modules/users/components/settings/settings.component'

import { LoginComponent } from './modules/auth/login/login.component'
import { RoutesComponent } from './modules/routes/components/routes/routes.component'
import { RouteDetailsComponent } from './modules/routes/components/route-details/route-details.component'

import { AuthGuard } from './guards';
const appRoutes: Routes = [
    { path: '',redirectTo: '/routes', pathMatch: 'full'  },
    { path: 'users', component: UsersComponent ,canActivate: [AuthGuard] },
    { path: 'routes', component: RoutesComponent ,canActivate: [AuthGuard] },
    { path: 'route/:id', component: RouteDetailsComponent ,canActivate: [AuthGuard] },
    { path: 'add-user', component: EditUserComponent,canActivate: [AuthGuard] },
    { path: 'edit-user/:id', component: EditUserComponent,canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent,canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'menu', loadChildren: './modules/menu/menu.module#MenuModule' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {}