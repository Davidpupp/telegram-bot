export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public extra?: Record<string, unknown>,
  ) {
    super(message);
  }
}

export const notFound = (what: string) => new AppError(404, 'NOT_FOUND', `${what} não encontrado(a).`);
export const badRequest = (code: string, message: string) => new AppError(400, code, message);
