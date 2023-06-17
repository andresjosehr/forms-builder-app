import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericServiceService } from 'app/shared/services/generic-service/generic-service.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageEntitiesService extends GenericServiceService<any> {

  constructor(
    private _http: HttpClient
  ) {
    super(_http, 'entities');
  }

    getOptionsForSelect(): Observable<any>{
        return this._http.get<any>(`${environment.api}/get-options-for-select`);
    }


}
