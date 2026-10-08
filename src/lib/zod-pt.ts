import { z, ZodIssueCode } from 'zod';

/** Mensagens padrão do zod em pt-BR. */
z.setErrorMap((issue, ctx) => {
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      return { message: issue.received === 'undefined' ? 'Campo obrigatório' : `Tipo inválido: esperado ${issue.expected}` };
    case ZodIssueCode.too_small:
      return { message: issue.type === 'string' ? `Precisa ter pelo menos ${issue.minimum} caractere(s)` : `Valor mínimo: ${issue.minimum}` };
    case ZodIssueCode.too_big:
      return { message: issue.type === 'string' ? `Pode ter no máximo ${issue.maximum} caracteres` : `Valor máximo: ${issue.maximum}` };
    case ZodIssueCode.invalid_enum_value:
      return { message: `Valor inválido. Use: ${issue.options.join(', ')}` };
    case ZodIssueCode.invalid_string:
      return { message: 'Formato inválido' };
    case ZodIssueCode.invalid_union:
      return { message: 'Combinação de campos inválida' };
    case ZodIssueCode.unrecognized_keys:
      return { message: `Campo(s) não permitido(s): ${issue.keys.join(', ')}` };
    default:
      return { message: ctx.defaultError };
  }
});
