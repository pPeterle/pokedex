import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  getClientErrorMessage(error: Error): string {
    // Para cada tipo de erro uma mensagem diferente
    return error.message ? error.message : 'Algum erro aconteceu';
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    return navigator.onLine ? error.message : 'Sem conexão à internet';
  }

}
