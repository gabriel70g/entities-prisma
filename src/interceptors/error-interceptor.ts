import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/apiResponse';


@Catch()
export class ErrorInterceptor implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let statusMessage = 'Internal Server Error';
    let errorMessage = 'Something went wrong';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      statusMessage = exceptionResponse?.statusMessage || exception.message;
      errorMessage = exceptionResponse?.message || exception.message;
    }

    const errorResponse: ApiResponse = {
      data: null,
      statusCode: status,
      statusMessage,
      errorMessage,
    };

    console.error('Error intercepted:', errorResponse); // Agrega este log

    response.status(status).json(errorResponse);
  }
}