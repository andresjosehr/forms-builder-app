import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { RealEntitiesListModule } from './entities-list/entities-list.module';
import { RealEntitiesListComponent } from './entities-list/entities-list.component';
import { ManageRealEntitiesModule } from './manage-entities/manage-entities.module';
import { ManageRealEntitiesComponent } from './manage-entities/manage-entities.component';

const routes: Route[] = [
    {
        path: '',
        component: RealEntitiesListComponent,
    },
    {
        path: 'lista',
        component: RealEntitiesListComponent,
    },
    {
        path: 'crear',
        component: ManageRealEntitiesComponent,
    },
    {
        path: 'editar/:id',
        component: ManageRealEntitiesComponent,
    }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ManageRealEntitiesModule,
    RealEntitiesListModule

  ]
})
export class EntitiesModule { }
