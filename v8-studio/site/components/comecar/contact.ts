// Campos de contato do formulário "Começar": estado, máscara do WhatsApp e validação com mensagens em português.
import type { LeadChannel } from "@/lib/leads";

export type ContactState = {
  name: string;
  company: string;
  channel: LeadChannel;
  whatsapp: string;
  email: string;
  consent: boolean;
  /** Quando a caixa de consentimento foi marcada (ISO 8601). */
  consentAt: string | null;
};

export type ContactField = "name" | "company" | "whatsapp" | "email" | "consent";
export type ContactErrors = Partial<Record<ContactField, string>>;

export const EMPTY_CONTACT: ContactState = { name: "", company: "", channel: "whatsapp", whatsapp: "", email: "", consent: false, consentAt: null };

/** Só os dígitos do número nacional (DDD + número), sem o 55 do país e sem zero na frente. */
export function phoneDigits(v: string) {
  let d = v.replace(/\D/g, "");
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  return d.replace(/^0+/, "").slice(0, 11);
}

/** (11) 1234-5678 enquanto digita; (11) 91234-5678 com 11 dígitos. */
export function formatPhone(d: string) {
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (d.length <= 10) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

/** Novo valor do campo de WhatsApp. Apagar um parêntese, espaço ou hífen apaga também o dígito antes dele. */
export function nextPhoneValue(prev: string, typed: string) {
  let d = phoneDigits(typed);
  if (typed.length < prev.length && d === phoneDigits(prev)) d = d.slice(0, -1);
  return formatPhone(d);
}

/** Celular com 11 dígitos (o terceiro é 9) ou fixo com 10 (o terceiro vai de 2 a 5). DDD sem zero. */
export function isPhoneValid(v: string) {
  const d = phoneDigits(v);
  if (!/^[1-9]{2}/.test(d)) return false;
  return (d.length === 11 && d[2] === "9") || (d.length === 10 && /[2-5]/.test(d[2]));
}

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
export const isEmailValid = (v: string) => v.trim().length <= 254 && EMAIL.test(v.trim());

export function validateContact(c: ContactState): ContactErrors {
  const e: ContactErrors = {};
  if (c.name.trim().length < 2) e.name = "Escreva seu nome para a gente saber com quem fala.";
  if (c.company.trim().length < 2) e.company = "Escreva o nome da empresa ou do seu negócio.";
  if (c.channel === "whatsapp") {
    if (!c.whatsapp.trim()) e.whatsapp = "Escreva seu WhatsApp com DDD.";
    else if (!isPhoneValid(c.whatsapp)) e.whatsapp = "Confira o número. Use o DDD e o número, como (11) 91234-5678.";
  } else {
    if (!c.email.trim()) e.email = "Escreva seu e-mail.";
    else if (!isEmailValid(c.email)) e.email = "Confira o e-mail. Ele precisa ter @ e domínio, como nome@empresa.com.br.";
  }
  if (!c.consent) e.consent = "Para enviar, marque que você concorda com a política de privacidade.";
  return e;
}

/** Ordem dos campos na tela, para levar o foco ao primeiro com erro. */
export const FIELD_ORDER: ContactField[] = ["name", "company", "whatsapp", "email", "consent"];

/** Primeiro nome com inicial maiúscula. */
export function firstName(name: string) {
  const f = name.trim().split(/\s+/)[0] ?? "";
  return f ? f.charAt(0).toLocaleUpperCase("pt-BR") + f.slice(1) : "";
}
