import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import {AbstractControl, FormArray, FormGroup, ValidationErrors} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {UserService} from 'app/core/user/user.service';
import {HttpValidationErrorResponse} from 'app/interfaces/http-responses/http-validation-error-response';
import { environment } from 'environments/environment.dev';
import { Observable } from 'rxjs';
// import saveAs from 'file-saver';

@Injectable({
	providedIn: 'root',
})
export class GlobalService {
	public httpValidationErrorMessage: string = 'Hay errores en el formulario';
	public httpGeneralErrorMessage: string = 'Ocurrio un error inesperado';
    public errorsLabels = {
        required: 'Este campo es requerido',
        email: 'El correo no es valido',
        minlength: 'El campo debe tener al menos {number} caracteres',
        maxlength: 'El campo debe tener maximo {number} caracteres',
        min: 'El campo debe ser mayor a {number}',
        max: 'El campo debe ser menor a {number}',
        pattern: 'El campo no cumple con el formato'
    };

	constructor(
        private _userService: UserService,
        private _snackBar: MatSnackBar,
        private _ngZone: NgZone,
        private _fuseConfirmationService: FuseConfirmationService,
        private _http: HttpClient
    ) {}

	getValidationErrors(formGroup: FormGroup, response: HttpValidationErrorResponse): FormGroup {
		const errors = response.errors ? response.errors : {};
		Object.entries(errors).map((error) => {
			try {
				const errorsObject = {};
				(error[1] as Array<string>).forEach((e: string, index: number) => {
					errorsObject[index] = e;
				});
                // console.log(error[0], errorsObject);
				formGroup.get(error[0]).setErrors(errorsObject);
			} catch (e) {}
		});
		return formGroup;
	}

	getValidationErrorsFormArray(formArray: FormArray, response: HttpValidationErrorResponse): FormArray {
		const errors = response.errors ? response.errors : {};
		Object.entries(errors).map((error) => {
			try {
				const errorsObject = {};
				const i = error[0].split('.')[1];
				const field = error[0].split('.')[2];
				(error[1] as Array<string>).forEach((e: string, index: number) => {
					errorsObject[index] = e.replace(error[0], field);
				});
				formArray.controls[i].get(field).setErrors(errorsObject);
			} catch (e) {}
		});
		return formArray;
	}

    getValidationErrorsFront(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(key => {
          const controlErrors: ValidationErrors = formGroup.get(key).errors;
          if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
                // console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                const error = {0: this.errorsLabels[keyError]}
                if(keyError === 'minlength' || keyError ==='min' || keyError === 'maxlength' || keyError ==='max'){
                    const number = Object.entries(controlErrors[keyError])[0][1];
                    error[0] = error[0].replace('{number}', number)
                }
                formGroup.get(key).setErrors(error);
            });
          }
        });
        return formGroup;
      }

	errorsLength(formControl: AbstractControl): Array<number> {
		if (formControl.errors) {
			return Object.keys(formControl.errors).map((value: string, index: number) => index);
		}

		return [];
	}

	openSnackBar(message: string, duration: number = 3000, type: string = 'success'): void {
		const className = type === 'success' ? ['bg-green-700', 'text-white'] : ['bg-red-700', 'text-red-100'];
		this._ngZone.run(() => {
			this._snackBar.open(message, null, {
				horizontalPosition: 'center',
				verticalPosition: 'top',
				duration: duration,
				panelClass: className,
			});
		});
	}

	formatDataForChart(chart: any, data: any, dateTimeKey: string, valueKey: string, label: string): any {
		const chartData = data.map((d) => {
			// add 4 hours to
			let datetime = new Date(d[dateTimeKey]);

			// substract 2 hours to datetime
			datetime = new Date(datetime.getTime() - 4 * 60 * 60 * 1000);

			return {
				x: datetime, y: d[valueKey]
			};
		});
		const chartCloned = JSON.parse(JSON.stringify(chart));
		chartCloned.series = {main: [{
			name: label,
			data: chartData
		}]};
		return chartCloned;
	}

    dasherize(str: string): string {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }


    confirmationDialog(text): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const dialogRef = this._fuseConfirmationService.open({
				title: 'Atención',
				message: text,
				icon: {
					show: true,
					name: 'heroicons_outline:exclamation',
					color: 'warning',
				},
				actions: {
					confirm: {
						show: true,
						label: 'Confirmar',
						color: 'accent',
					},
					cancel: {
						show: true,
						label: 'Cancelar',
					},
				},
				dismissible: true,
			})

			dialogRef.afterClosed().subscribe((result) => {
				if (result === 'confirmed') {
					resolve(true)
				} else {
					resolve(false)
				}
			})
		})
	}

    checkLog(): Observable<any>{

        // First erease log file content


        return this._http.get(`${environment.api}/check-log`, { responseType: 'text' });
    }

	// saveDataAsCSV(data: any, fileName: string): void {
	// 	const replacer = (key: any, value: any): any => value === null ? '' : value; // specify how you want to handle null values here
	// 	const header = Object.keys(data[0]);
	// 	const csv = data.map((row: any) => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
	// 	csv.unshift(header.join(';'));
	// 	const csvArray = csv.join('\r\n');

	// 	const blob = new Blob([csvArray], {type: 'text/csv'});

	// 	let d = (new Date() as any);
	// 	d = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
	// 	saveAs(blob, `${fileName} ${d}.csv`);
	// }
}
