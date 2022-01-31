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

  it('show notification and console', () => {
    spyOn(console, 'error');

    globalErroHandler.handleError(new Error());

    expect(notifier.showError).toHaveBeenCalledWith('Algum Erro aconteceu');
    expect(console.error).toHaveBeenCalled();
  })


});
