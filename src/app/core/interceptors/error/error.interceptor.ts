import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { NotificationService } from "../../../features/services/concretes/notification.service";


export const ErrorInterceptor: HttpInterceptorFn = (request, next) => {
    const notificationService = inject(NotificationService);
  
    return next(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Unkown Error';
  
        if (error.error instanceof ErrorEvent) {
          // İstemci tarafında olan hata
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.error && error.error.Detail) {
          // Sunucu tarafında özel hata mesajı
          errorMessage = `Error: ${error.error.Detail}`;
        } else if (error.error && error.error.message) {
          // Sunucu tarafında alternatif hata mesajı (örneğin Exception mesajı)
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Sunucu tarafında genel hata
          errorMessage = 'Unkown Error';
        }
  
        notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  };