import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformIsDeletedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        if (data && Array.isArray(data.items)) {
          // Si la donnée est une liste d'items (comme dans une réponse paginée)
          return {
            ...data,
            items: data.items.map((item) => ({
              ...item,
              isDeleted: item.isDeleted && item.isDeleted.data && item.isDeleted.data[0] === 1, // Vérification supplémentaire
            })),
          };
        }

        if (Array.isArray(data)) {
          // Si la donnée est une liste d'objets simples
          return data.map((item) => ({
            ...item,
            isDeleted:false, // Vérification supplémentaire
          }));
        }

        // Ajout du champ isDeleted même si il n'existe pas
        if (data && !data.isDeleted) {
          return {
            ...data,
            isDeleted: false, // Ajout de la valeur par défaut si non définie
          };
        }

        return data; // Si aucune transformation n'est nécessaire, retourne les données inchangées
      }),
    );
  }
}
