import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ValidationException } from './validation.error.exeption';

@Injectable()
export class ValidationExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BadRequestException) {
          const response = error.getResponse() as any;
          let message = 'Requête invalide';

          // Obtenir le premier message d'erreur
          if (Array.isArray(response.message) && response.message.length) {
            // Transformer le message en un format plus lisible
            const errorMessage = response.message[0];
            message = this.transformErrorMessage(errorMessage);
          }

          return throwError(new ValidationException(message));
        }
        return throwError(error);
      }),
    );
  }

  // Fonction pour formater le message d'erreur
  private transformErrorMessage(errorMessage: string): string {
    const field = errorMessage.split('.').pop(); // Récupérer le nom du champ
    return `Donnée non renseignée : ${field}`;
  }
}
