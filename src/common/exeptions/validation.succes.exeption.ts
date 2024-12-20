import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SimpleResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return {
            status: {
              code: '200',
              message: `Operation effectuée avec succès`,
            },
            count: data.length, // Renommer count à totalItems pour clarification
            hasError: false,
            items: data,
          };
        }
  
        // Si `data` contient une structure paginée
        if (data?.data && Array.isArray(data.data)) {
          return {
            status: {
              code: '200',
              message: `Operation effectuée avec succès`,
            },
            count: data.count || data.data.length, // Total des éléments paginés
            hasError: false,
            items: data?.data
          };
        }
  
        // Si un seul élément
        return {
          status: {
            code: '200',
            message: 'Operation effectuée avec succès',
          },
          count: 1, // Indique un seul élément
          hasError: false,
          item: [data],
        };
      }),
    );
  }
  
}
