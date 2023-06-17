import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { EntitiesListComponent } from 'app/shared/generic-components/entities-list/entities-list.component';
import { GlobalService } from 'app/shared/services/global/global.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { App } from '../app';
import { AppService } from '../service/app.service';
@Component({
  selector: 'app-apps-list',
  templateUrl: './apps-list.component.html',
  styles: [`
    ::ng-deep .search-form .mat-mdc-text-field-wrapper{
        background-color: #fff;
    }
    ::ng-deep .search-form .mat-mdc-form-field-subscript-wrapper{
        display: none;
    }
  `]
})
export class AppsListComponent extends EntitiesListComponent<App>{
  columns: Array<string> = [ 'id', 'name', 'actions'];
  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
    protected _formBuilder: FormBuilder,
    protected _globalService: GlobalService,
    protected _userService: UserService,
    protected _service: AppService,
    protected _fuseConfirmationService: FuseConfirmationService,
  ) {
    const searchFormGroup = _formBuilder.group({
        searchString: [],
            name: [],
    });
    super(_activatedRoute, _router, _formBuilder, _globalService, _userService, _fuseConfirmationService, searchFormGroup, _service, 'Aplicaciones', 'Aplicacion');
  }
}
