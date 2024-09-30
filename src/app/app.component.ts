import { Component } from '@angular/core';
import { Location } from "@angular/common";
import {Router, NavigationEnd} from "@angular/router";
import { AuthenticationService } from './modules/auth/authentication.service';
import { Admin } from './models';
import 'hammerjs';
import {TranslateService} from '@ngx-translate/core';
import {SettingsService} from './services/settings.service';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
  route: string;
    private previousRoute: string;
  currentUser: Admin;

    constructor(private location: Location, private router: Router, private authenticationService: AuthenticationService, public translate: TranslateService, public settingsService: SettingsService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    translate.addLangs(['ru', 'uk']);
    translate.setDefaultLang('ru');

     const settingsLang = settingsService.getLanguage();
     translate.use(settingsLang);
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(val => {
      if (location.path() != "") {
          this.previousRoute = this.route;
          this.route = location.path();
      } else {
          this.route = "Home";
      }
    });
  }

    public goToRoutes() {
        if (this.previousRoute && this.previousRoute.substr(0, 7) === '/routes' && (this.route && this.route.substr(0, 7) !== '/routes')) {
            this.location.back();
        } else {
            this.router.navigate(['/routes'], {queryParamsHandling: "merge"});
        }
    }

  private get isSuperAdmin(){
    return this.currentUser && this.currentUser.claims && this.currentUser.claims.superAdmin===true;
  }
  private get isCompanyAdmin(){
    return this.currentUser && this.currentUser.claims && this.currentUser.claims.companyAdmin===true;
  }
}