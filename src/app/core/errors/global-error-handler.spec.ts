import { GlobalErrorHandler } from './global-error-handler';
import { NotificationService } from './notification.service';

describe('Pokemon Fight Service', () => {
  let globalErroHandler: GlobalErrorHandler;
  let notifier: NotificationService;

  beforeEach(() => {

    notifier = jasmine.createSpyObj<NotificationService>('NotificationService', {
      showError: undefined
    })

    globalErroHandler = new GlobalErrorHandler(notifier);
  });

  it('show notification and console on generic error', () => {
    spyOn(console, 'error');

    globalErroHandler.handleError(new Error());

    expect(notifier.showError).toHaveBeenCalledWith('Algum Erro aconteceu');
    expect(console.error).toHaveBeenCalled();
  })

  it('show notification and console on specific error', () => {
    spyOn(console, 'error');

    const errorMessage = 'Custom error message';
    globalErroHandler.handleError(new Error(errorMessage));

    expect(notifier.showError).toHaveBeenCalledWith(errorMessage);
    expect(console.error).toHaveBeenCalled();
  })
});
