import { CLINIC } from '../clinic.js';

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** Dobra linhas em 75 octetos, como pede a RFC 5545. */
function fold(line: string) {
  const out: string[] = [];
  let buf = '';
  for (const ch of line) {
    if (Buffer.byteLength(buf + ch) > 73) {
      out.push(buf);
      buf = ' ';
    }
    buf += ch;
  }
  out.push(buf);
  return out.join('\r\n');
}

export function buildIcs(a: { id: string; start: Date; end: Date; serviceName: string; doctorName: string; createdAt: Date }) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Clinica Mutton Oftalmologia//Agendamento//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${a.id}@mutton.demo`,
    `DTSTAMP:${stamp(new Date())}`,
    `CREATED:${stamp(a.createdAt)}`,
    `DTSTART:${stamp(a.start)}`,
    `DTEND:${stamp(a.end)}`,
    `SUMMARY:${escape(`${a.serviceName} – ${CLINIC.name}`)}`,
    `DESCRIPTION:${escape(
      `Consulta com ${a.doctorName}.\nLeve um documento com foto e a carteirinha do convênio.\nDúvidas: WhatsApp ${CLINIC.whatsapp}.`,
    )}`,
    `LOCATION:${escape(CLINIC.fullAddress)}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete da consulta na Clínica Mutton',
    'TRIGGER:-P1D',
    'END:VALARM',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Sua consulta é daqui a 2 horas',
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
