export class AppError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(message, details = null, code = 'validation/invalid-input') {
  return new AppError(400, code, message, details);
}

export function unauthorized(message = 'Autenticação necessária.', code = 'auth/unauthorized') {
  return new AppError(401, code, message);
}

export function forbidden(message = 'Acesso negado.', code = 'auth/forbidden') {
  return new AppError(403, code, message);
}

export function notFound(message, code = 'resource/not-found') {
  return new AppError(404, code, message);
}
