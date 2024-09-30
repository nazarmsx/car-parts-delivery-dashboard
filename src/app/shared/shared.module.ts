import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import {NgbModule,} from '@ng-bootstrap/ng-bootstrap';

export function HttpLoaderFactory (httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  imports: [CommonModule, HttpClientModule,NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })],
  declarations: [DatePickerComponent],
  exports: [CommonModule,TranslateModule,DatePickerComponent]
})
export class SharedModule {}