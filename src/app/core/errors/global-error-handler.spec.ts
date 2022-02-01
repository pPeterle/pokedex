import { GlobalErrorHandler } from './global-error-handler';
import { NotificationService } from '../services';

describe('Pokemon Fight Service', () => {
  let globalErroHandler: GlobalErrorHandler;
  let notifier: NotificationService;

  beforeEach(() => {
    notifier = jasmine.createSpyObj<NotificationService>(
      'NotificationService',
      {
        showError: undefined,
      }
    );
    spyOn(console, 'error');

    globalErroHandler = new GlobalErrorHandler(notifier);
  });

  it('show notification and console on generic error', () => {
    globalErroHandler.handleError(new Error());

    expect(notifier.showError).toHaveBeenCalledWith('Algum Erro aconteceu');
    expect(console.error).toHaveBeenCalled();
  });

  it('show notification and console on specific error', () => {
    const errorMessage = 'Custom error message';
    globalErroHandler.handleError(new Error(errorMessage));

    expect(notifier.showError).toHaveBeenCalledWith(errorMessage);
    expect(console.error).toHaveBeenCalled();
  });
});
