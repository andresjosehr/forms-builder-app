import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManageAppComponent} from './manage-app.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {DateModule} from 'app/shared/date.module';
import { ManageRealEntitiesModule } from './manage-entities/manage-entities.module';

@NgModule({
  declarations: [
    ManageAppComponent
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
	MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DateModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    ManageRealEntitiesModule
  ]
})
export class ManageAppModule { }
