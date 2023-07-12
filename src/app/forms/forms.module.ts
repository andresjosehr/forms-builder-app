import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ManageForm1Module } from './manage-form-1/manage-form-1.module';
import { FormsListComponent } from './forms-list/forms-list.component';
import { ManageForm1Component } from './manage-form-1/manage-form-1.component';
import { FormsListModule } from './forms-list/forms-list.module';
import { ManageForm2Component } from './manage-form-2/manage-form-2.component';
import { ManageForm2Module } from './manage-form-2/manage-form-2.module';
import { CanDeactivateGuard } from 'app/guards/can-deactivate.guard';

const routes: Route[] = [
    {
        path: '',
        component: FormsListComponent,
    },
    {
        path: 'lista',
        component: FormsListComponent,
    },
    {
        path: 'crear-formulario-1',
        component: ManageForm1Component,
        canDeactivate: [CanDeactivateGuard]
    },
    {
        path: 'editar-formulario-1/:id',
        component: ManageForm1Component,
        canDeactivate: [CanDeactivateGuard]
    },

    {
        path: 'crear-formulario-2',
        component: ManageForm2Component,
        canDeactivate: [CanDeactivateGuard]
    },
    {
        path: 'editar-formulario-2/:id',
        component: ManageForm2Component,
        canDeactivate: [CanDeactivateGuard]
    }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ManageForm1Module,
    ManageForm2Module,
    FormsListModule

  ]
})
export class FormsModule { }
