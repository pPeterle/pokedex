import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  getClientErrorMessage(error: Error): string {
    return error.message ? error.message : 'Algum erro aconteceu';
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    switch(error.status) {
      case 404: {
        if (error.url && error.url.includes('pokemon')) {
          return 'Pokemon não encontrado';
        }
        return 'Página não encontrada';
      }
      case 400: {
        return 'Parâmetros errados.'
      }
    }

    return navigator.onLine ? error.message : 'Sem conexão à internet';
  }
}
