import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SimpleResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Si la donnée est un tableau d'utilisateurs
        if (Array.isArray(data)) {
          return {
            status: {
              code: '200',
              message: `Operation effectuée avec succès`,
            },
            count: data.length,
            hasError: false,
            items: data,
          };
        }

        // Si la donnée est un seul utilisateur
        return {
          status: {
            code: '200',
            message: 'Operation effectuée avec succès',
          },
          count: 1,
          hasError: false,
          item: [data],
        };
      }),
    );
  }
}
