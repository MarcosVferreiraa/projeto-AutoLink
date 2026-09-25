import { AppError } from '../errors.js';

export function errorHandler(error, _req, res, _next) {
  void _next;
  console.error('Erro não tratado na API:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      details: error.details,
    });
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      message: 'JSON inválido.',
      code: 'validation/invalid-json',
    });
  }

  return res.status(500).json({
    message: 'Erro interno do servidor.',
    code: 'server/internal-error',
  });
}
