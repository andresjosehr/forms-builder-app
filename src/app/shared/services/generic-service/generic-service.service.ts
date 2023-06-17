import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PaginatorParams } from 'app/interfaces/general/paginator-params';
import { HttpSimpleResponse } from 'app/interfaces/http-responses/http-simple-response';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericServiceService<T> {

  constructor(
        protected _httpClient: HttpClient,
        @Inject(String)
        protected path: string = ''
    ) {}


    getList(search: SearchObject, paginatorParams?: PaginatorParams): Observable<any> {
        const params = new HttpParams({
            fromObject: {
                ...paginatorParams,
                ...search
            },
        } as any);

        return this._httpClient.get<any>(`${environment.api}/${this.path}`, {params});
    }


    get(id: string | number): Observable<T> {
        return this._httpClient.get<T>(`${environment.api}/${this.path}/${id}`);
    }

    store(data: T): Observable<HttpSimpleResponse> {
        return this._httpClient.post<HttpSimpleResponse>(`${environment.api}/${this.path}`, data);
    }

    update(id: string | number, data: T): Observable<HttpSimpleResponse> {
		return this._httpClient.put<HttpSimpleResponse>(`${environment.api}/${this.path}/${id}`, data);
	}

    destroy(id: string | number): Observable<HttpSimpleResponse> {
		return this._httpClient.delete<HttpSimpleResponse>(`${environment.api}/${this.path}/${id}`);
	}

    getAll(): Observable<{message: string, data: T[]}> {
        return this._httpClient.get<{message: string, data: T[]}>(`${environment.api}/get-all-${this.path}`);
    }

}

export interface SearchObject{
	[key: string]: string | number | boolean;
}
