import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, HttpClientModule, NgbModule, TranslateModule],
  declarations: [DatePickerComponent],
  exports: [CommonModule, TranslateModule, DatePickerComponent],
})
export class SharedModule {}
