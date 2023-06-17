import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageRealEntitiesComponent } from './manage-entities.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { DateModule } from 'app/shared/date.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';





@NgModule({
  declarations: [
    ManageRealEntitiesComponent
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
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule
  ],
    exports: [
        ManageRealEntitiesComponent
    ]
})
export class ManageRealEntitiesModule { }
