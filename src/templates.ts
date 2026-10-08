import type { JourneyStepKey, Procedure } from '@prisma/client';
import { CLINIC } from './clinic.js';

/** Variáveis: {nome}, {serviço}, {médico}, {dia}, {data}, {hora} (+ {procedimento}, {link}, {telefone}). */
export type TemplateVars = Record<string, string | undefined>;

export function render(template: string, vars: TemplateVars): string {
  return template.replace(/\{([^}]+)\}/g, (match, key: string) => {
    const value = vars[key];
    return value ?? match;
  });
}

/** Só o primeiro nome soa mais próximo no WhatsApp. */
export const firstName = (name: string) => name.trim().split(/\s+/)[0];

export const TEMPLATES = {
  confirmacao:
    'Olá, {nome}! 👁️ Sua consulta de {serviço} com {médico} está marcada para {dia}, {data}, às {hora}. Endereço: Rua Santiago, 289 – Jardim América. Leve um documento com foto e a carteirinha do convênio. Toque em Confirmar ou Remarcar.',
  remarcacao:
    'Pronto, {nome}! Sua consulta de {serviço} com {médico} foi remarcada para {dia}, {data}, às {hora}. Endereço: Rua Santiago, 289 – Jardim América. Toque em Confirmar ou Remarcar.',
  lembrete: 'Oi, {nome}! Passando para lembrar da sua consulta amanhã às {hora} com {médico}. Podemos confirmar?',
  confirmado:
    'Obrigada, {nome}! ✅ Sua consulta de {dia}, {data}, às {hora} está confirmada. Até lá! Se precisar, é só chamar por aqui.',
  remarcarLink:
    'Sem problemas, {nome}! Escolha um novo horário pelo link: {link}. Seu horário atual fica reservado até você escolher outro.',
  cancelado:
    'Olá, {nome}. Sua consulta de {dia}, {data}, às {hora} foi cancelada. Quando quiser remarcar, é só responder por aqui ou ligar para {telefone}.',
  posOpOk: 'Que ótimo, {nome}! 💙 Seguimos acompanhando sua recuperação. Qualquer coisa, é só chamar.',
  posOpDuvida:
    'Obrigada por avisar, {nome}. Nossa equipe já recebeu sua dúvida e vai te chamar em instantes por aqui. 💬',
  posOpDor:
    'Sentimos muito, {nome}. 🙏 Avisamos a equipe médica agora mesmo e vamos te ligar em instantes. Se a dor for muito forte ou a visão piorar de repente, venha direto à clínica ou procure o pronto-atendimento.',
} as const;

const NOTA_EQUIPE = '\n\n_(Texto de demonstração: na versão final, esta mensagem é escrita pela equipe médica.)_';

const PROCEDURE_LABEL: Record<Procedure, string> = {
  CATARATA: 'cirurgia de catarata',
  CROSSLINK: 'crosslink',
  REFRATIVA: 'cirurgia refrativa',
  PTERIGIO: 'cirurgia de pterígio',
};

export const procedureLabel = (p: Procedure) => PROCEDURE_LABEL[p];

export const POST_OP_TEMPLATES: Record<JourneyStepKey, string> = {
  D_MINUS_7:
    'Olá, {nome}! Faltam 7 dias para a sua {procedimento} com {médico}, no dia {data}, às {hora}. 📋 Separe seus exames e confirme com a gente se ainda falta algum. Estamos com você em cada etapa!',
  D_MINUS_1:
    'Oi, {nome}! Amanhã é o dia da sua {procedimento}. 🌙 Faça jejum conforme orientado, não use maquiagem e venha com um acompanhante. Chegue às {hora} na Rua Santiago, 289.',
  D_DAY:
    'Bom dia, {nome}! Hoje é o grande dia. 💙 Respire fundo: nossa equipe está pronta para te receber. Traga documento, exames e os colírios que já estiver usando.',
  D_PLUS_1:
    'Oi, {nome}! Como você está se sentindo hoje, um dia depois da {procedimento}? Use os colírios nos horários combinados e evite coçar o olho. Toque numa opção abaixo:',
  FIRST_RETURN:
    'Olá, {nome}! Está chegando o seu primeiro retorno pós-operatório com {médico}. 👁️ É uma consulta rápida para ver como está a cicatrização. Qualquer desconforto, avise a gente.',
  D_PLUS_30:
    'Oi, {nome}! Já faz um mês da sua {procedimento}. 🎉 Esperamos que esteja enxergando melhor a cada dia. Conta pra gente: como está sua visão?',
};

export function postOpMessage(key: JourneyStepKey, vars: TemplateVars) {
  return render(POST_OP_TEMPLATES[key], vars) + NOTA_EQUIPE;
}

export const BUTTONS = {
  appointment: [
    { id: 'CONFIRM', label: 'Confirmar' },
    { id: 'RESCHEDULE', label: 'Remarcar' },
  ],
  postOp: [
    { id: 'OK', label: 'Estou bem' },
    { id: 'DOUBT', label: 'Tenho uma dúvida' },
    { id: 'PAIN', label: 'Sinto dor' },
  ],
};

export const BUTTON_LABELS: Record<string, string> = {
  CONFIRM: 'Confirmar',
  RESCHEDULE: 'Remarcar',
  OK: 'Estou bem',
  DOUBT: 'Tenho uma dúvida',
  PAIN: 'Sinto dor',
};

export const clinicPhone = CLINIC.phones[0];
