import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import {NgbModule,} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { UsersComponent } from './components/users/users.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { SettingsComponent } from './components/settings/settings.component';

import {SharedModule} from '../../shared/shared.module'


@NgModule({
    declarations: [
      UsersComponent,
      EditUserComponent,
      SettingsComponent
    ],
    imports: [
      CommonModule,
      RouterModule,
      FormsModule,ReactiveFormsModule,
      NgbModule,
      NgSelectModule,
      SharedModule
    ],
    providers: []
})

export class UsersModule {}