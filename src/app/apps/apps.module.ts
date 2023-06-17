import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsListModule } from './apps-list/apps-list.module';
import { Route, RouterModule } from '@angular/router';
import { AppsListComponent } from './apps-list/apps-list.component';
import { ManageAppModule } from './manage-app/manage-app.module';
import { ManageAppComponent } from './manage-app/manage-app.component';
import { ManageRealEntitiesModule } from './manage-app/manage-entities/manage-entities.module';

const routes: Route[] = [
    {
        path: '',
        component: AppsListComponent,
    },
    {
        path: 'lista',
        component: AppsListComponent,
    },
    {
        path: 'crear',
        component: ManageAppComponent,
    },
    {
        path: 'editar/:id',
        component: ManageAppComponent,
    }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AppsListModule,
    ManageRealEntitiesModule
  ]
})
export class AppsModule { }
