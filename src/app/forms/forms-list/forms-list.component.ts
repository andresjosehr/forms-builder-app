import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { EntitiesListComponent } from 'app/shared/generic-components/entities-list/entities-list.component';
import { GlobalService } from 'app/shared/services/global/global.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { App } from '../app';
import { AppService } from '../service/app.service';
import { MatDialog } from '@angular/material/dialog';
import { FormsService } from '../service/forms.service';
@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styles: [`
    ::ng-deep .search-form .mat-mdc-text-field-wrapper{
        background-color: #fff;
    }
    ::ng-deep .search-form .mat-mdc-form-field-subscript-wrapper{
        display: none;
    }
  `]
})
export class FormsListComponent extends EntitiesListComponent<App>{
  columns: Array<string> = [ 'id', 'name', 'label', 'layout', 'actions'];
  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
    protected _formBuilder: FormBuilder,
    protected _globalService: GlobalService,
    protected _userService: UserService,
    protected _service: FormsService,
    protected _fuseConfirmationService: FuseConfirmationService,
    public dialog: MatDialog
  ) {
    const searchFormGroup = _formBuilder.group({
        searchString: [],
            name: [],
    });
    super(_activatedRoute, _router, _formBuilder, _globalService, _userService, _fuseConfirmationService, searchFormGroup, _service, 'Fromularios', 'Formulario');
  }

  openDialog() {
    const dialogRef = this.dialog.open(PickLayoutComponent, {
        width: '550px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}




@Component({
    selector: 'app-pick-layout',
    template: `
        <div>
            <div class='text-3xl font-semibold text-center'>Elige un layout para el formulario</div>
            <div class='flex w-full gap-5 mt-8'>
                <div class='w-1/2'>
                    <button (click)="pick('/formularios/crear-formulario-1')" class="w-full rounded mr-1 px-3 bg-primary-300 text-on-primary-300" mat-stroked-button>Layout 1</button>
                </div>
                <div class='w-1/2'>
                    <button (click)="pick('/formularios/crear-formulario-2')" class="w-full rounded mr-1 px-3 bg-primary-300 text-on-primary-300" mat-stroked-button>Layout 2</button>
                </div>
            </div>
        </div>
    `,
})
  export class PickLayoutComponent {

    constructor(
        public _router: Router,
        public dialogRef: MatDialog,
    ) { }

    pick(url): void {
        this._router.navigate([url]);
        this.dialogRef.closeAll();
    }

  }
