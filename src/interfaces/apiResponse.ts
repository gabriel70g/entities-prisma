export interface ApiResponse<T = any> {
    data: T | null;
    statusCode: number;
    statusMessage: string;
    errorMessage?: string | null;
  }