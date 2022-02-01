import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { HttpErrorInterceptor } from './http-error-interceptor';
import { NotificationService } from '../services/notification.service';
import { HttpBaseUrlInterceptor } from './http-base-url-inteceptor';

describe('Http error interceptor', () => {
  let controller: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpBaseUrlInterceptor,
          multi: true,
        },
      ],
    });

    controller = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('add base url in the request', () => {
    let result: string | undefined;
    httpClient.get<string>('path').subscribe({
      next: (data) => {
        result = data;
      },
    });
    const dataApi = 'resultApiCall';
    controller.expectOne(`${environment.api_url}path`).flush(dataApi);

    expect(result).toBe(dataApi);
  });
});
