export class AppError extends Error {
  constructor(
    statusCode,
    code,
    message,
    details = null
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(
  message,
  details = null,
  code = 'validation/invalid-input'
) {
  return new AppError(400, code, message, details);
}

