import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {SharedModule} from '../../shared/shared.module'

@NgModule({
    declarations: [
      LoginComponent
    ],
    imports: [CommonModule,HttpClientModule,RouterModule,FormsModule,ReactiveFormsModule,SharedModule
    ],
    providers: [
    ]
})

export class AuthModule {}