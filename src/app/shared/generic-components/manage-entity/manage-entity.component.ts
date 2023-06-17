/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { HttpValidationErrorResponse } from 'app/interfaces/http-responses/http-validation-error-response';
import { GlobalService } from 'app/shared/services/global/global.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-manage-entity',
    template: '',
})
export class ManageEntityComponent<Entity> {
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;
    entityID: string = '';
    dasherizedEntity: string;
    file;
    afterGetEntity: Subject<any> = new Subject();
    afterCreateEntity: Subject<any> = new Subject();
    beforeCreateEntity: Subject<any> = new Subject();

    constructor(
        protected _globalService: GlobalService,
        protected _activateRoute: ActivatedRoute,
        protected _formBuilder: FormBuilder,
        protected _router: Router,
        @Inject('entityFormGroup') protected entityFormGroup: FormGroup,
        @Inject('service') protected _service: any,
        @Inject('string') protected _pluralEntity: string,
        @Inject('string') protected _singularEntity: any
    ) {
        this.checkRouteParams();
        this.dasherizedEntity = this._globalService.dasherize(this._pluralEntity);
    }



    checkRouteParams(): void {
        this._activateRoute.params.subscribe((params) => {
            if (params.id) {
                this.entityID = params.id;
                this.getEntity();
            }
        });
    }

    getEntity(): void {
        this._service.get(this.entityID).subscribe((response) => {
            this.entityFormGroup.patchValue(response.data);
            this.afterGetEntity.next(response.data);
        });
    }

    createEntity(redirectAfterCreated = true): void {

        if(this.thereAreFormErrors()){
            return;
        }

        this.beforeCreateEntity.next(this.entityFormGroup.value);

        this._service.store(this.entityFormGroup.value)
            // takeUntil(this._unsubscribeAll)
            .pipe()
            .subscribe(
                (response) => {
                    this.afterCreateEntity.next(response);
                    this.entityFormGroup.enable();
                    // navigate with query params
                    if(redirectAfterCreated){
                        this._router.navigate([`/${this.dasherizedEntity}/lista`,{ m: 1 }]);
                    }
                },
                (response: HttpValidationErrorResponse) => this.handleErrorRequestError(response)
            );
    }

    updateEntity(): void {

        if(this.thereAreFormErrors()){
            return;
        }

        // Sign in
        this._service
            .update(this.entityID, this.entityFormGroup.value).pipe().subscribe(() => {
                    this.entityFormGroup.enable();
                    this._router.navigate([`/${this.dasherizedEntity}/lista`, { m: 2 } ]);
                },
                (response: HttpValidationErrorResponse) => this.handleErrorRequestError(response)
            );
    }

    thereAreFormErrors(): boolean{

        const invalid = [];
        const controls = this.entityFormGroup.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }

        // Return if the form is invalid
        if (this.entityFormGroup.invalid) {
            this.entityFormGroup.setValue(this.entityFormGroup.value);

            this.entityFormGroup.markAllAsTouched();
            this.entityFormGroup = this._globalService.getValidationErrorsFront(
                this.entityFormGroup
            );
            this._globalService.openSnackBar( 'Hay errores en el formulario', 2500, 'error' );

            return true;
        }

        // Disable the form
        this.entityFormGroup.disable();
        this.entityFormGroup.updateValueAndValidity();

        // Hide the alert
        this.showAlert = false;

        return false
    }

    handleErrorRequestError(response): void {
        this.entityFormGroup.enable();

        if ( response.message === this._globalService.httpValidationErrorMessage ) {
            this.entityFormGroup = this._globalService.getValidationErrors( this.entityFormGroup, response );

            // Set the alert
            this.alert = {type: 'error',message: `${response.message}`};

            // Show the alert
            this.showAlert = true;
        }
    }
}
