import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './shared/components/home/home.component';
import {NgbModalModule ,NgbModule,} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { HeaderComponent } from './shared/components/header/header.component';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoutesModule } from './modules/routes/routes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { TokenInterceptor } from './helpers';
import '../assets/styles';
import {SharedModule} from './shared/shared.module'
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/de';
registerLocaleData(localeFr, 'de');


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModalModule,
        NgbModule,
        HttpClientModule,
        FormsModule,
        UsersModule,
        ReactiveFormsModule,
        CommonModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        NgSelectModule,
        AuthModule,
        RoutesModule,
      SharedModule
    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ],
    entryComponents: [

    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {}