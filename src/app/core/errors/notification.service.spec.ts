import { NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from './notification.service';

describe('Notification Service', () => {
  let notificationService: NotificationService;
  let fakeNgZone: NgZone;
  let fakeSpinner: NgxSpinnerService;
  let fakeSnackBar: MatSnackBar;

  beforeEach(() => {
    fakeNgZone = jasmine.createSpyObj<NgZone>('NgZone', {
      run: undefined
    });

    fakeSpinner = jasmine.createSpyObj<NgxSpinnerService>('NgxSpinnerService', {
      hide: Promise.resolve(),
    });

    fakeSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', {
      open: undefined,
    });

    notificationService = new NotificationService(fakeSnackBar, fakeNgZone, fakeSpinner);
  });

  it('show snackbar with error message', () => {
    const error = 'Custom Error Mensage';
    fakeNgZone.run = jasmine.createSpy().and.callFake((arg) => {
      arg();
    })
    notificationService.showError(error);


    expect(fakeNgZone.run).toHaveBeenCalled();
    expect(fakeSpinner.hide).toHaveBeenCalled();
    expect(fakeSnackBar.open).toHaveBeenCalledWith(error, 'X', {
      panelClass: ['error'],
      duration: 2500,
    })
  });
});
