import { AppError } from '../utils/AppError.js';

export function validate({ body, query, params }) {
  return (req, _res, next) => {
    req.validated = req.validated || {};

    if (body) {
      const result = body.safeParse(req.body);
      if (!result.success) {
        return next(formatZodError(result.error));
      }
      req.validated.body = result.data;
    }

    if (query) {
      const result = query.safeParse(req.query);
      if (!result.success) {
        return next(formatZodError(result.error));
      }
      req.validated.query = result.data;
    }

    if (params) {
      const result = params.safeParse(req.params);
      if (!result.success) {
        return next(formatZodError(result.error));
      }
      req.validated.params = result.data;
    }

    next();
  };
}

function formatZodError(zodError) {
  const details = zodError.issues.map((issue) => ({
    field: issue.path.join('.') || 'request',
    message: issue.message,
  }));
  return new AppError(400, 'VALIDATION_ERROR', 'Validation failed', details);
}