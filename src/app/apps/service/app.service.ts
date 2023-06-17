import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpSimpleResponse } from 'app/interfaces/http-responses/http-simple-response';
import { GenericServiceService } from 'app/shared/services/generic-service/generic-service.service';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import { App } from '../app';
@Injectable({
    providedIn: 'root',
})
export class AppService extends GenericServiceService<App> {

    private cancelSubject = new Subject<void>();

    constructor(protected _httpClient: HttpClient) {
        super(_httpClient, 'apps');
    }

    store(data: App): Observable<any> {
        return this._httpClient.post(`${environment.api}/apps`, data);
    }

    abort(): Observable<any> {
        this.cancelSubject.next();
        return this._httpClient.get(`${environment.api}/apps/abort-creation`);
        // Emite un evento en el sujeto de cancelación para indicar que se debe cancelar la ejecución del script
    }
}
