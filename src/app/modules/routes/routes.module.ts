import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule,} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';

import {RoutesComponent} from './components/routes/routes.component'
import {RouteDetailsComponent} from './components/route-details/route-details.component'
import {RouteHistoryComponent} from './components/status-history/route-history.component'
import { DebounceMouseEnterDirective } from '../../helpers/DebounceEventsDirectives';
import { NgxGalleryModule } from 'ngx-gallery';
import {SharedModule} from '../../shared/shared.module'
import {DatePickerComponent} from '../../shared/components/date-picker/date-picker.component'

@NgModule({
  declarations: [RoutesComponent,RouteDetailsComponent,RouteHistoryComponent,DebounceMouseEnterDirective],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxGalleryModule,
    SharedModule
  ],
  providers: []
})

export class RoutesModule {}