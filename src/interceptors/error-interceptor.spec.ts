import { Test, TestingModule } from '@nestjs/testing';
import { ErrorInterceptor } from './error-interceptor';
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorInterceptor],
    }).compile();

    interceptor = module.get<ErrorInterceptor>(ErrorInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should handle HttpException correctly', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('Forbidden', 403);

    interceptor.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: null,
      statusCode: 403,
      statusMessage: 'Forbidden',
      errorMessage: 'Forbidden',
    });
  });

  it('should handle non-HttpException correctly', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    } as unknown as ArgumentsHost;

    const exception = new Error('Test Error');

    interceptor.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: null,
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      errorMessage: 'Something went wrong',
    });
  });
});