export interface RateLimitError {
  isRateLimit: true;
  message: string;
  retryAfter: number;
}

export interface UserNotFoundError {
  isUserNotFound: true;
  message: string;
}

export type FetchError = Error | RateLimitError | UserNotFoundError;

export function isRateLimitError(error: unknown): error is RateLimitError {
  return typeof error === "object" && error !== null && "isRateLimit" in error;
}

export function isUserNotFoundError(
  error: unknown
): error is UserNotFoundError {
  return (
    typeof error === "object" && error !== null && "isUserNotFound" in error
  );
}
