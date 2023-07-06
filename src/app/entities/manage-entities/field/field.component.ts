import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ManageEntitiesService } from 'app/entities/service/manage-entities.service';
import { GlobalService } from 'app/shared/services/global/global.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html'
})
export class FieldComponent {

    @Input() field: FormGroup;
    @Input() options: any;
    @Input() entitiesFormArray: any;
    @Input() fieldIndex: number;
    @Input() entityFormGroup: FormGroup;


    validationControl: FormControl = new FormControl();
    validationListed: any;


    constructor(
        public _globalService: GlobalService,
        public _formBuilder: FormBuilder,
        public _service: ManageEntitiesService,
    ) {}

    ngOnInit() {

        setTimeout(() => {
            this.validationListed = this.options.validations.filter((validation) => {
                return !this.validations.value.find((validationValue) => validationValue.validation_id === validation.id);
            })
            ;
        }, 1000);

        this.validationControl.valueChanges.subscribe((value) => {
            if (value) {
                this.addValidation(value);
                this.validationControl.setValue(null);
            }
        });

        console.log(this.validations);
    }

    get validations(): FormArray {
        return this.field.get('validations') as FormArray;
    }

    addValidation(validation_id: number) {
        this.validations.push(this._formBuilder.group({
            validation_id: [validation_id],
            field_id: [this.field.get('id').value],
            value: []
        }));
        this.validationListed = this.validationListed.filter((validation) => validation.id !== validation_id);
    }

    getValidation(validation_id: number): string {
        return this.options?.validations?.find((validation) => validation.id === validation_id);
    }


    removeValidation(i: number) {
        this.validationListed.push(this.options.validations.find((validation) => validation.id === this.validations.value[i].validation_id));
        this.validations.removeAt(i);
    }


    deleteField(event, id): void{
        event.preventDefault();
        event.stopPropagation();

        this._globalService.confirmationDialog(`Seguro que quieras eliminar esta entidad? ID: ${id}, index: ${this.fieldIndex}`).then((result) => {

            if(!result){
                return;
            }

            if(!id){

                (this.entityFormGroup.get('fields') as FormArray).removeAt(this.fieldIndex);
                this._globalService.openSnackBar('Entidad eliminada correctamente');
                return;
            }

            this._service.deleteField(id).subscribe((response) => {
                (this.entityFormGroup.get('fields') as FormArray).removeAt(this.fieldIndex);
                this._globalService.openSnackBar('Entidad eliminada correctamente');
            });
        });
    }
}
