import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { NotificationService } from '.';

export const QUERY_LIMIT = 20;

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  private formatErrors(error: any) {
    if (error.message) {
      this.notificationService.showError(error.message);
    }
    return throwError(() => error);
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http
      .get<T>(`${environment.api_url}${path}`, { params })
      .pipe(catchError((err) => this.formatErrors(err)));
  }

  getWithUrl<T>(
    url: string,
    params: HttpParams = new HttpParams()
  ): Observable<T> {
    return this.http
      .get<T>(url, { params })
      .pipe(catchError((err) => this.formatErrors(err)));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(`${environment.api_url}${path}`, JSON.stringify(body))
      .pipe(catchError((err) => this.formatErrors(err)));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(`${environment.api_url}${path}`, JSON.stringify(body))
      .pipe(catchError((err) => this.formatErrors(err)));
  }

  delete(path: string): Observable<any> {
    return this.http
      .delete(`${environment.api_url}${path}`)
      .pipe(catchError((err) => this.formatErrors(err)));
  }
}
