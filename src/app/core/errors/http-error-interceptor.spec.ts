import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { HttpErrorInterceptor } from './http-error-interceptor';
import { NotificationService } from './notification.service';

describe('Http error interceptor', () => {
  let fakeNotificationService: NotificationService;
  let controller: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    fakeNotificationService = jasmine.createSpyObj<NotificationService>(
      'NotificationService',
      {
        showError: undefined,
      }
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: NotificationService,
          useValue: fakeNotificationService,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
          deps: [NotificationService],
        },
      ],
    });

    controller = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('show message error generic for error 404', async () => {
    const url = `${environment.api_url}abcdef`;
    httpClient.get(url).subscribe({
      error: () => {},
    });

    controller.expectOne(url).flush('', {
      status: 404,
      statusText: 'Not Found',
    });

    expect(fakeNotificationService.showError).toHaveBeenCalledWith(
      'Página não encontrada'
    );
  });

  it('show message error generic for pokemon not find', async () => {
    const url = `${environment.api_url}pokemon/abcdef`;
    httpClient.get(url).subscribe({
      error: () => {},
    });

    controller.expectOne(url).flush('', {
      status: 404,
      statusText: 'Not Found',
    });

    expect(fakeNotificationService.showError).toHaveBeenCalledWith(
      'Pokemon não encontrado'
    );
  });

  it('show message error navigator offline', () => {
    spyOnProperty(window.navigator, 'onLine', 'get').and.returnValue(false);
    const url = `${environment.api_url}pokemon`;
    httpClient.get(url).subscribe({
      error: () => {},
    });

    controller.expectOne(url).flush('', {
      status: 404,
      statusText: 'Not Found',
    });
    expect(fakeNotificationService.showError).toHaveBeenCalledWith(
      'Sem conexão à internet'
    );
  });
});
