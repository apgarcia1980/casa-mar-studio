export interface ApiFieldError {
  readonly field: string;
  readonly code: string;
  readonly message: string;
}
export interface ApiError {
  readonly code: string;
  readonly status: number;
  readonly message: string;
  readonly correlationId?: string;
  readonly fieldErrors?: readonly ApiFieldError[];
  readonly retryable?: boolean;
}
