import { Component, OnInit } from '@angular/core';
import { ManageEntitiesService } from './service/manage-entities.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'app/shared/services/global/global.service';
import { HttpValidationErrorResponse } from 'app/interfaces/http-responses/http-validation-error-response';
import { ManageEntityComponent } from 'app/shared/generic-components/manage-entity/manage-entity.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-manage-entities',
  templateUrl: './manage-entities.component.html'
})
export class ManageRealEntitiesComponent extends ManageEntityComponent<any> {

    options;
    form: FormGroup = this._formBuilder.group({
        entities: this._formBuilder.array([])
    });
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
        const searchFormGroup = _formBuilder.group({
            searchString: [],
                name: [],
        });

        const form = _formBuilder.group({
            entities: _formBuilder.array([])
        });

        super(_globalService, _activatedRoute, _formBuilder, _router, form, _service, 'Aplicaciones', 'Aplicacion');

        this.form = form;
    }

    ngOnInit(): void {

        this._service.getOptionsForSelect().subscribe((response) => {
            this.options = response.data;
        });

        this.afterGetEntity.subscribe((entities) => {
            this.creatingEntity = false;
            entities.forEach((entity) => {
                this.addEntity(entity);
                    entity.fields.forEach((field) => {
                            this.addField(this.entitiesFormArray.length - 1, field);
                    });
            });
            entities.forEach((entity, i) => {
                entity.relationships.forEach((relationship) => {
                    this.addRelationship(i, relationship);
                });
            });
        });

        this.afterCreateEntity.subscribe((response) => {
            // this.creatingEntity = false;
            this.fillValues(response);
        });
        this.beforeCreateEntity.subscribe((response) => {
            // this.creatingEntity = true;
            // this.checkLog();
        });
    }

    get entitiesFormArray(): FormArray{
        return this.form.get('entities') as FormArray;
    }

    getFields(i: number): FormArray{
        return this.entitiesFormArray.at(i).get('fields') as FormArray;
    }

    getRelationships(i: number): FormArray{
        return this.entitiesFormArray.at(i).get('relationships') as FormArray;
    }


    addEntity(entity: any = {}, addID= false): void{
        const searchableList = entity.searchable_list === 1 ? true : false;
        this.entitiesFormArray.push(this._formBuilder.group({
            id: [entity.id],
            app_id: [this.entityID],
            build_front: [false],
            build_back: [false],
            name: [entity.name || '', Validators.required],
            path: [entity.path || 'src/app', Validators.required],
            label: [entity.label ||'', Validators.required],
            searchable_list: [searchableList, Validators.required],
            fields: this._formBuilder.array([]),
            relationships: this._formBuilder.array([]),
        }));

        // add empty field


        if(addID){
            this.addField(this.entitiesFormArray.length - 1, {
                id: null,
                name: 'id',
                label: 'ID',
                field_type_id: 2,
                input_type_id: 2,
                searchable: 0,
                visible: 1,
                editable: 0,
            });
        }
    }

    addField(i, field: any = {}): void{

        const searchable = field.searchable === 0 ? false : true;
        const visible = field.visible === 0 ? false : true;
        const editable = field.editable === 0 ? false : true;
        const nullable = field.sql_properties?.nullable === 0 ? false : true;

        // Search for the related entity name from entity_id
        const relatedEntity = this.form.value.entities.find((entity) => {

            return entity.id === field?.relationship_properties?.related_entity_id;
        }) || {};

        const relatedEntitySqlName = this.form.value.entities.find((entity) => {
            return entity.id === field?.sql_properties?.related_entity_id;
        })?.name || '';


        // Search for the related field name from field_id

        this.getFields(i).push(this._formBuilder.group({
            id: [field.id || null],
            name: [field.name || '', Validators.required],
            label: [field.label || '', Validators.required],
            field_type_id: [field.field_type_id || 1, Validators.required],
            input_type_id: [field.input_type_id || 1, Validators.required],
            searchable: [searchable, Validators.required],
            entity_id: [field.entity_id || null],
            options: [field.options || null],
            visible: [visible, Validators.required],
            editable: [editable],
            sqlProperties: this._formBuilder.group({
                id: [field.sql_properties?.id],
                related_entity_id: [relatedEntitySqlName || null],
                sql_property_type_id: [field.sql_properties?.sql_property_type_id || 1, Validators.required],
                length: [field.sql_properties?.length || null],
                nullable: [nullable || false],
            }),
            // relationshipProperties: this._formBuilder.group({
            //     id: [field.relationship_properties?.id],
            //     related_entity_id: [relatedEntity.name || null],
            //     related_field_id: [relatedFieldName || null],
            //     relation_type_id: [field.relationship_properties?.relation_type_id || null],
            // }),
            validations: this._formBuilder.group({
                id: [field.validations?.id],
                front: [field.validations?.front || []],
                back: [field.validations?.back || []],
            }),
        }));
    }

    addRelationship(i, relation: any = {}): void{

        const relatedEntity = this.form.value.entities.find((entity) => {
            return entity.id === relation?.related_entity_id;
        }) || {};


        this.getRelationships(i).push(this._formBuilder.group({
            id: [relation.id || null],
            entity_id: [relation.entity_id || null],
            relation_type_id: [relation.relation_type_id || null],
            related_entity_id: [relatedEntity.name || null],
        }));
    }

    getRelatedEntityFields(entityName): FormArray{
        const entity = this.form.value.entities.find((entity) => entity.name === entityName);
        return entity?.fields || [];

    }


    debug(){
        console.log(this.form.value);
    }

    fillValues(response): void {
        response.data.forEach((entity) => {
            // find the entity in the form and set the id
            const entityFormGroup = (this.form.get('entities') as FormArray).controls.find((control) => control.get('name').value === entity.name) as FormGroup;
            entityFormGroup.patchValue(entity);
            entityFormGroup.get('build_front').setValue(false);
            entityFormGroup.get('build_back').setValue(false);

            // find the fields in the form and set the id
            (entityFormGroup.get('fields') as FormArray).controls.forEach((field) => {
                const fieldData = entity.fields.find((fieldData) => fieldData.name === field.get('name').value);

                field.patchValue(fieldData);
                field.get('sqlProperties').patchValue(fieldData.sql_properties);

                const searchable = fieldData.searchable === 0 ? false : true;
                const visible = fieldData.visible === 0 ? false : true;
                const editable = fieldData.editable === 0 ? false : true;
                const nullable = fieldData.sql_properties?.nullable === 0 ? false : true;




                field.get('searchable').patchValue(searchable);
                field.get('visible').patchValue(visible);
                field.get('editable').patchValue(editable);
                field.get('sqlProperties').get('nullable').patchValue(nullable);

            });

            (entityFormGroup.get('relationships') as FormArray).controls.forEach((control) => {
                const relationshipData = entity.relationships.find((r) => r.name === control.get('name').value);

                control.patchValue(relationshipData);

                const relatedEntity = this.form.value.entities.find((entity) => {
                    return entity.id === relationshipData?.related_entity_id;
                }) || {};

                control.get('related_entity_id').patchValue(relatedEntity.name);
            });

        });
    }

    deleteEntity(event, id, index): void{
        event.preventDefault();
        event.stopPropagation();

        this._globalService.confirmationDialog('Seguro que quieras eliminar esta entidad?').then((result) => {

            if(!result){
                return;
            }

            if(!id){

                this.entitiesFormArray.removeAt(index);
                this._globalService.openSnackBar('Entidad eliminada correctamente');
                return;
            }

            this._service.destroy(id).subscribe((response) => {

                this.entitiesFormArray.removeAt(index);
                this._globalService.openSnackBar('Entidad eliminada correctamente');
            });
        });
    }


    async checkLog(): Promise<void> {

        this._globalService.checkLog()
        .pipe(catchError(error => {
            setTimeout(() => {
                if(this.creatingEntity){
                    this.checkLog();
                }
            }, 1000);

          return error;
        }))
        .subscribe(response => {
            if(response){
                this.processOutput = response;
            }

            setTimeout(() => {
                var div = document.getElementById("output");
                div.scrollTop = div.scrollHeight - div.clientHeight;
                if(this.creatingEntity){
                    this.checkLog();
                }
            }, 100);

        })
        await this.sleep(1000);

    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
