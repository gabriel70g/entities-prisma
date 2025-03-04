import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
  } from "@nestjs/common";
  import { Observable } from "rxjs";
  import { map } from "rxjs/operators";
  import { ApiResponse } from "../interfaces/apiResponse";
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
  
      return next.handle().pipe(
        map((data) => {
          return {
            data: data ?? null,
            statusCode: response.statusCode,
            statusMessage: response.statusMessage || "OK",
            errorMessage: null
          };
        })
      );
    }
  }