import { map } from 'rxjs/operators';
import { Document } from 'mongoose';
import { isDefined } from 'class-validator';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { CallHandler, ExecutionContext, mixin, NestInterceptor, Type } from '@nestjs/common';

export interface MongoDocumentInterceptorOptions<T> {
  type: Type<T>,
}

export function MongoDocumentInterceptor<T>(
    options: MongoDocumentInterceptorOptions<T>): Type<NestInterceptor<unknown, T>> {

  class MongoDocumentInterceptor implements NestInterceptor {

    public intercept(context: ExecutionContext, next: CallHandler): Observable<T | Array<T> | undefined> {
      return next.handle()
        .pipe(map((document: Document|Array<Document>) => {
          if(isDefined(document)) {
            if(Array.isArray(document)) {
              return plainToClass<T, unknown>(options.type, document.map(item => item?.toObject()));
            } else {
              return plainToClass<T, unknown>(options.type, document?.toObject());
            }
          } else {
            return undefined;
          }
        }));
    }

  }

  const Interceptor = mixin(MongoDocumentInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
