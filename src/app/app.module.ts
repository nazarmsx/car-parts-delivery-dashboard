import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './shared/components/home/home.component';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/components/header/header.component';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoutesModule } from './modules/routes/routes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { TokenInterceptor } from './helpers';
import { SharedModule } from './shared/shared.module';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
registerLocaleData(localeDe, 'de');


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
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateHttpLoader,
          },
        }),
        AuthModule,
        RoutesModule,
        SharedModule,
    ],
    providers: [
      {
        provide: TRANSLATE_HTTP_LOADER_CONFIG,
        useValue: { prefix: '/assets/i18n/', suffix: '.json' },
      },
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {}