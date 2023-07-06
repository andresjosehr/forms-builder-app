import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'app/shared/services/global/global.service';
import { HttpValidationErrorResponse } from 'app/interfaces/http-responses/http-validation-error-response';
import { ManageEntityComponent } from 'app/shared/generic-components/manage-entity/manage-entity.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { catchError, from } from 'rxjs';
import { ManageEntitiesService } from '../service/manage-entities.service';

@Component({
  selector: 'app-manage-entities',
  templateUrl: './manage-entities.component.html'
})
export class ManageRealEntitiesComponent extends ManageEntityComponent<any> {

    options;
    entityFG: FormGroup;

    creatingEntity: boolean = false;
    processOutput;

    constructor(
        public _service: ManageEntitiesService,
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
            build_layout_1: [],
            build_layout_2: [],
            built_edition_layout_1: [],
            built_edition_layout_2: [],
            name: [],
            frontend_path: ['src/app'],
            label: [],
            steps: _formBuilder.array([]),
            fields: _formBuilder.array([]),
            relationships: _formBuilder.array([]),
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

                entity.steps.forEach((step) => {
                    this.addStep(step);
                });

                entity.fields.forEach((field) => {
                        this.addField(field);
                });

                this.entityFG.valueChanges.subscribe((value) => {
                    this.entityFG.get('built_edition_layout_1').setValue(0, {emitEvent: false});
                    this.entityFG.get('built_edition_layout_2').setValue(0, {emitEvent: false});
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
    getSteps(): FormArray{
        return (this.entityFG.get('steps') as FormArray);
    }

    getRelationships(i: number): FormArray{
        return (this.entityFG.get('entityes') as FormArray).controls.at(i).get('relationships') as FormArray;
    }

    addField(field: any = {}, step?): void{

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
            built_edition_layout_1: [field.built_edition_layout_1 || 0],
            built_edition_layout_2: [field.built_edition_layout_2 || 0],
            label: [field.label || '', Validators.required],
            field_type_id: [field.field_type_id || 1, Validators.required],
            input_type_id: [field.input_type_id || 1, Validators.required],
            searchable: [searchable, Validators.required],
            entity_id: [field.entity_id || null],
            options: [field?.options?.map(e=>e.name)?.join(',') || null],
            visible: [visible, Validators.required],
            step: [step || field.step],
            editable: [editable],
            validations: validationFA,
        }));
        // Value changes to this last field
        const len = this.getFields().length - 1;

        this.getFields().controls[len].valueChanges.subscribe((value) => {
            this.entityFG.get('built_edition_layout_1').setValue(0, {emitEvent: false});
            this.entityFG.get('built_edition_layout_2').setValue(0, {emitEvent: false});
            this.getFields().controls[len].get('built_edition_layout_1').setValue(0, {emitEvent: false});
            this.getFields().controls[len].get('built_edition_layout_2').setValue(0, {emitEvent: false});
        });
    }

    addStep(step: any = {}): void{
        this.getSteps().push(this._formBuilder.group({
            id: [step.id || null],
            label: [step.label || 'Paso #' + (this.getSteps().length + 1)],
            order: [step.order || this.getSteps().length + 1],
        }));

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
            }, 100);
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
            this.entityFG.get('build_layout_1').setValue(true, {emitEvent: false});
        }


        this.createEntity(false)
      }
}
