import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';


@Injectable({providedIn: 'root'})
export class SettingsService {
  constructor (public translate: TranslateService) {}
  getLanguage():string{
    let settingsLang= localStorage.getItem('menuLang');
    if(!settingsLang || settingsLang===''){
      const browserLang = this.translate.getBrowserLang();
      return  browserLang.match(/ru|uk/) ? browserLang : 'ru'
    }
    return settingsLang;
  }
  setLanguage(lang:string):void{
    return localStorage.setItem('menuLang',lang);
  }

}
