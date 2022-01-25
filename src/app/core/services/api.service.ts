import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,  throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

export const QUERY_LIMIT = 50;
export const POPULATE_POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=100';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
  ) {}

  private formatErrors(error: any) {
    return  throwError(() => error.error);
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  getWithUrl<T>(url: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(url, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  delete(path: string): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`
    ).pipe(catchError(this.formatErrors));
  }
}
