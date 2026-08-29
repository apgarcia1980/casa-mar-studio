export type ContentRepositoryErrorCode = 'NOT_FOUND' | 'DATA_UNAVAILABLE' | 'NETWORK_ERROR';

export class ContentRepositoryError extends Error {
  constructor(
    readonly code: ContentRepositoryErrorCode,
    message: string,
    override readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ContentRepositoryError';
  }
}
