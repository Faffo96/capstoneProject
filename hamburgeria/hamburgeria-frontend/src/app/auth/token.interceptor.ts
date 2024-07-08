import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Recupera il token dal localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Clona la richiesta e aggiungi l'intestazione di autorizzazione
      const clonedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log(clonedRequest)
      return next.handle(clonedRequest);
    } else {
      // Se non c'è token, passa la richiesta senza modificarla
      return next.handle(request);
    }
  }
}
