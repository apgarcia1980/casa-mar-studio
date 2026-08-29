import { HttpInterceptorFn } from '@angular/common/http';

const CORRELATION_HEADER = 'X-Correlation-ID';
export const correlationIdInterceptor: HttpInterceptorFn = (request, next) => {
  const correlationId = request.headers.get(CORRELATION_HEADER) ?? crypto.randomUUID();
  return next(request.clone({ setHeaders: { [CORRELATION_HEADER]: correlationId } }));
};
