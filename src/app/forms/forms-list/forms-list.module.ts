import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {DateModule} from 'app/shared/date.module';
import { FuseConfirmationModule } from '@fuse/services/confirmation';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { PickLayoutComponent, FormsListComponent } from './forms-list.component';
import { AppService } from '../service/app.service';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    FormsListComponent,
    PickLayoutComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule,
    MatButtonModule,
    DateModule,
    FuseConfirmationModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ]
})
export class FormsListModule { }
