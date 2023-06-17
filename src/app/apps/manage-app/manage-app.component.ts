import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpValidationErrorResponse } from 'app/interfaces/http-responses/http-validation-error-response';
import { ManageEntityComponent } from 'app/shared/generic-components/manage-entity/manage-entity.component';
import { GlobalService } from 'app/shared/services/global/global.service';
import { App } from '../app';
import { AppService } from '../service/app.service';
import { WebsocketsService } from 'app/shared/services/websockets/websockets.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-manage-app',
  templateUrl: './manage-app.component.html',
  styles: [`
  .fira-code{
    font-family: "Fira Code", "Courier New", monospace;
  }
  `]
})
export class ManageAppComponent extends ManageEntityComponent<App> implements OnInit {
    appFormGroup: FormGroup;

    processOutput: string;
    creatingApp: boolean = false;

    constructor(
      protected _globalService: GlobalService,
		  protected _activateRoute: ActivatedRoute,
		  protected _formBuilder: FormBuilder,
		  protected _router: Router,
      protected _service: AppService,
    //   protected _websockets: WebsocketsService

    ) {
        const entityFormGroup = _formBuilder.group({
            name: [, Validators.required],
        });
        super(_globalService, _activateRoute, _formBuilder, _router, entityFormGroup, _service, 'Aplicaciones', 'Aplicacion');
    }
    ngOnInit(): void {

    }

    async createEntity(): Promise<void> {



        if(this.thereAreFormErrors()){
            return;
        }

        const confirm = await this._globalService.confirmationDialog('¿Está seguro de crear la aplicación?. Se crearan los repositorios locales y remotos correspondientes');

        if(!confirm){
            return;
        }

        this.creatingApp = true;


        this._service.store(this.entityFormGroup.value)
            // takeUntil(this._unsubscribeAll)
            .pipe()
            .subscribe(
                (response) => {

                    this.creatingApp = false;
                    console.log(response)
                    // this.entityFormGroup.enable();
                    // navigate with query params
                    // this._router.navigate([`/${this.dasherizedEntity}/lista`,{ m: 1 }]);
                },
                (response: HttpValidationErrorResponse) => {
                    console.log(response)
                }
            );

            this.checkLog();

    }

    async checkLog(): Promise<void> {

            this._globalService.checkLog()
            .pipe(catchError(error => {
                setTimeout(() => {
                    if(this.creatingApp){
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
                    if(this.creatingApp){
                        this.checkLog();
                    }
                }, 100);

            })
            await this.sleep(1000);

    }

    abort(): void {
        this._service.abort().subscribe(response => {
            console.log(response);
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
