import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ManageForm1Component } from 'app/forms/manage-form-1/manage-form-1.component';
import { GlobalService } from 'app/shared/services/global/global.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<ManageForm1Component> {
    constructor(
        private globalService: GlobalService,
    ) { }
    canDeactivate(component: ManageForm1Component): Promise<boolean> | boolean {
        console.log(component.changed);
        if(component.changed){
            return this.globalService.confirmationDialog('¿Está seguro que desea salir de la página?, si sale perderá los cambios realizados')
        }
        return true;
    //   return component.canDeactivate ? component.canDeactivate() : true;
    }
  }
