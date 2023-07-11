import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'app/shared/services/global/global.service';
import { HttpValidationErrorResponse } from 'app/interfaces/http-responses/http-validation-error-response';
import { ManageEntityComponent } from 'app/shared/generic-components/manage-entity/manage-entity.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { catchError, from } from 'rxjs';
import { FormsService } from '../service/forms.service';

@Component({
  selector: 'app-manage-form-2',
  templateUrl: './manage-form-2.component.html'
})
export class ManageForm2Component extends ManageEntityComponent<any> {

    options;
    entityFG: FormGroup;

    creatingEntity: boolean = false;
    processOutput;

    constructor(
        public _service: FormsService,
        public _formBuilder: FormBuilder,
        public _globalService: GlobalService,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        public _fuseConfirmationService: FuseConfirmationService,
        public _userService: UserService,
    ) {

        const entity = _formBuilder.group({
            id: [],
            app_id: [],
            code: [],
            build: [],
            built_edition: [],
            name: [],
            label: [],
            layout: [2],
            fields: _formBuilder.array([]),
            relationships: _formBuilder.array([]),
            steps: _formBuilder.array([]),
        });

        super(_globalService, _activatedRoute, _formBuilder, _router, entity, _service, 'Aplicaciones', 'Aplicacion');
        this.entityFG = entity;


    }

    ngOnInit(): void {

        this._service.getOptionsForSelect().subscribe((response) => {
            this.options = response.data;
        });

        this.afterGetEntity.subscribe((entity) => {
            this.creatingEntity = false;
                this.entityFG.patchValue(entity, {emitEvent: false});


                entity.fields.forEach((field) => {
                        this.addField(field);
                });

                this.entityFG.valueChanges.subscribe((value) => {
                    this.entityFG.get('built_edition').setValue(0, {emitEvent: false});
                });
            // entities.forEach((entity, i) => {
            //     entity.relationships.forEach((relationship) => {
            //         this.addRelationship(i, relationship);
            //     });
            // });
        });

        this.afterCreateEntity.subscribe(({response, error}) => {
            this.creatingEntity = false;
            if(!error){
                this.fillValues(response.data);
            }
        });
        this.beforeCreateEntity.subscribe((response) => {
            this.creatingEntity = true;
            this.checkLog();
        });
    }



    getFields(): FormArray{
        return (this.entityFG.get('fields') as FormArray);
    }

    getRelationships(i: number): FormArray{
        return (this.entityFG.get('entityes') as FormArray).controls.at(i).get('relationships') as FormArray;
    }

    addField(field: any = {}): void{

        const searchable = field.searchable === 0 ? false : true;
        const visible = field.visible === 0 ? false : true;
        const editable = field.editable === 0 ? false : true;



        const validationFA = this._formBuilder.array([]);
        field.validations?.forEach((v) => {
            (validationFA as FormArray).push(this._formBuilder.group({
                validation_id: [v.pivot.validation_id],
                field_id: [v.pivot.field_id],
                value: [v.pivot.value],
            }));
        });

        // Search for the related field name from field_id

        this.getFields().push(this._formBuilder.group({
            id: [field.id || null],
            code: [field.code || this.code()],
            name: [field.name || ''],
            built_edition: [field.built_edition || 0],
            label: [field.label || '', Validators.required],
            field_type_id: [field.field_type_id || 1, Validators.required],
            input_type_id: [field.input_type_id || 1, Validators.required],
            related_entity_id: [field.related_entity_id || null],
            searchable: [searchable, Validators.required],
            entity_id: [field.entity_id || null],
            options: [field?.options?.map(e=>e.name)?.join(',') || null],
            visible: [visible, Validators.required],
            editable: [editable],
            step: [null],
            validations: validationFA,
        }));
        // Value changes to this last field
        const len = this.getFields().length - 1;

        this.getFields().controls[len].valueChanges.subscribe((value) => {
            this.entityFG.get('built_edition').setValue(0, {emitEvent: false});
            this.getFields().controls[len].get('built_edition').setValue(0, {emitEvent: false});
        });
    }

    addRelationship(i, relation: any = {}): void{

        // const relatedEntity = this.form.value.entities.find((entity) => {
        //     return entity.id === relation?.related_entity_id;
        // }) || {};


        // this.getRelationships(i).push(this._formBuilder.group({
        //     id: [relation.id || null],
        //     entity_id: [relation.entity_id || null],
        //     relation_type_id: [relation.relation_type_id || null],
        //     related_entity_id: [relatedEntity.label || null],
        // }));
    }




    debug(){
        console.log(this.entityFG.value);
    }

    fillValues(entity): void {
            // find the entity in the form and set the id
            this.entityFG.patchValue(entity, {emitEvent: false});

            // find the fields in the form and set the id
            this.getFields().controls.forEach((field) => {
                const fieldData = entity.fields.find((fieldData) => fieldData.code === field.get('code').value);

                field.patchValue(fieldData, {emitEvent: false});

                const searchable = fieldData.searchable === 0 ? false : true;
                const visible = fieldData.visible === 0 ? false : true;
                const editable = fieldData.editable === 0 ? false : true;




                field.get('options').patchValue(fieldData.options?.map(e=>e.name)?.join(',') || '', {emitEvent: false});
                field.get('searchable').patchValue(searchable, {emitEvent: false});
                field.get('visible').patchValue(visible, {emitEvent: false});
                field.get('editable').patchValue(editable, {emitEvent: false});

            });


    }




    async checkLog(): Promise<void> {
        try {
            const response = await this._globalService.checkLog().toPromise();
            if (response) {
                this.processOutput = response;
            }

            setTimeout(() => {
                const div = document.getElementById("output");
                div.scrollTop = div.scrollHeight - div.clientHeight;
                if (this.creatingEntity) {
                    this.checkLog();
                }
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                if (this.creatingEntity) {
                    this.checkLog();
                }
            }, 1000);
        }

        await this.sleep(1000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    code(): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < 20; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      }

      preCreateEntity(layout = null){

        if(layout == 1){
            this.entityFG.get('build').setValue(true, {emitEvent: false});
            this.entityFG.get('built_edition').setValue(false, {emitEvent: false});
        }

        this.createEntity(false)
      }
}