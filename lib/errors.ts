// Backend-Guideline 4장 공통 에러 포맷: { error: { code, message } }
export interface AppError {
  error: {
    code: string;
    message: string;
  };
}

export function appError(code: string, message: string): AppError {
  return { error: { code, message } };
}

export function isAppError(value: unknown): value is AppError {
  return typeof value === "object" && value !== null && "error" in value;
}

export const ERROR_CODES = {
  SCOUT_LIMIT_EXCEEDED: "SCOUT_LIMIT_EXCEEDED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  NOT_FOUND: "NOT_FOUND",
  FORBIDDEN: "FORBIDDEN",
} as const;
