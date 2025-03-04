import { Test, TestingModule } from '@nestjs/testing';
import { ResponseInterceptor } from './response-interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { ApiResponse } from '../interfaces/apiResponse';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform response correctly', (done) => {
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue({
          statusCode: 200,
          statusMessage: 'OK',
        }),
      }),
    };

    const mockCallHandler: Partial<CallHandler> = {
      handle: jest.fn().mockReturnValue(of({ key: 'value' })),
    };

    interceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler).subscribe((result: ApiResponse<any>) => {
      expect(result).toEqual({
        data: { key: 'value' },
        statusCode: 200,
        statusMessage: 'OK',
        errorMessage: null,
      });
      done();
    });
  });

  it('should handle null data correctly', (done) => {
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue({
          statusCode: 200,
          statusMessage: 'OK',
        }),
      }),
    };

    const mockCallHandler: Partial<CallHandler> = {
      handle: jest.fn().mockReturnValue(of(null)),
    };

    interceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler).subscribe((result: ApiResponse<any>) => {
      expect(result).toEqual({
        data: null,
        statusCode: 200,
        statusMessage: 'OK',
        errorMessage: null,
      });
      done();
    });
  });
});