import { Component } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { AuthenticationService } from '../../../modules/auth/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SettingsService} from '../../../services/settings.service';
import {TranslateService} from '@ngx-translate/core';
import {Location} from "@angular/common";
import {filter} from 'rxjs/operators';

@Component({
    selector: 'header-comp',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  langForm: FormGroup;
  route: string;
  private previousRoute: string;

  constructor(private router: Router, private location: Location, private authenticationService: AuthenticationService, private formBuilder: FormBuilder, public settingsService: SettingsService, public translate: TranslateService) {

    let lang=settingsService.getLanguage();
    this.langForm = this.formBuilder.group({
        lang: [lang, Validators.required]
      }
    );
  }
  ngOnInit(){
    this.langForm.get('lang').valueChanges .subscribe((val:string) => {
      if(val && val!==''){
        this.settingsService.setLanguage(val);
        this.translate.use(val);

      }
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(val => {
      if (this.location.path() != "") {
        this.previousRoute = this.route;
        this.route = this.location.path();
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

  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  get f () { return this.langForm.controls; }

}