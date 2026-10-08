# Clínica Mutton · API de agendamento e acompanhamento cirúrgico

Backend do beta de **agendamento online** e **acompanhamento pós-operatório** da Clínica Mutton Oftalmologia (Sorocaba/SP).
O front (Next.js) é um projeto à parte e consome esta API.

O que funciona de verdade:

- agenda com horários de 20 em 20 min, bloqueios e trava contra dois agendamentos no mesmo horário;
- mensagens de WhatsApp (simuladas por padrão ou pela API oficial da Meta) com os botões Confirmar e Remarcar;
- lembrete da véspera automático (cron) ou manual;
- jornada cirúrgica com "avançar o tempo", respostas da paciente e alertas de dor ou dúvida;
- painel com métricas, agenda, relatórios e **tempo real via SSE**.

**Stack:** Node 22, TypeScript, Fastify 5, zod, PostgreSQL 16, Prisma 6, node-cron, pino-pretty, Vitest e Supertest.

---

## Como rodar localmente

Pré-requisitos: Node 22+ e Docker.

```bash
cp .env.example .env
docker compose up -d        # Postgres 16 (cria os bancos mutton e mutton_test)
npm i
npm run db:migrate          # aplica as migrations
npm run db:seed             # popula com a clínica, a agenda, o histórico e as jornadas
npm run dev                 # http://localhost:3333
```

Usuários do painel:

| E-mail                 | Senha     | Papel     |
| ---------------------- | --------- | --------- |
| `recepcao@mutton.demo` | `demo123` | RECEPTION |
| `gerencia@mutton.demo` | `demo123` | MANAGER   |

Para testar as rotas, abra o [`requests.http`](./requests.http), que tem exemplos de todas elas. Ele funciona na extensão REST Client do VS Code e no cliente HTTP do JetBrains.

### Scripts

| Script               | O que faz                                                                    |
| -------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`        | API com recarga automática (tsx watch)                                       |
| `npm run build`      | `prisma generate` + compilação para `dist/`                                  |
| `npm start`          | sobe a versão compilada                                                      |
| `npm test`           | Vitest + Supertest no banco `mutton_test`                                    |
| `npm run db:migrate` | `prisma migrate dev` (desenvolvimento)                                       |
| `npm run db:deploy`  | `prisma migrate deploy` (produção)                                           |
| `npm run db:seed`    | zera os dados e recria o seed                                                |
| `npm run db:reset`   | garante as migrations e recria o seed (é o que o "Reiniciar demonstração" faz) |
| `npm run typecheck`  | checagem de tipos                                                            |

> O botão **"Reiniciar demonstração"** do front deve chamar `POST /demo/reset`. Ele faz o mesmo que `db:reset`, mas dentro do processo e em cerca de 1 s, e publica o evento `demo.reset` para o painel recarregar.

---

## Variáveis de ambiente (`.env`)

| Variável                | Obrigatória | Descrição                                                                                                  |
| ----------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | sim         | Conexão Postgres. Local: `postgresql://postgres:postgres@localhost:5432/mutton`. Neon: a URL com `?sslmode=require`. |
| `JWT_SECRET`            | sim         | Segredo do JWT do painel (mínimo de 8 caracteres; em produção, use `openssl rand -hex 32`).                |
| `FRONTEND_URL`          | sim         | Origem liberada no CORS (aceita várias, separadas por vírgula). Também monta o link de remarcação no WhatsApp. |
| `DEMO_MODE`             | não         | `true` liga as rotas `/demo/*`.                                                                            |
| `WHATSAPP_TOKEN`        | não         | Token da Meta Cloud API. Com `WHATSAPP_PHONE_ID`, ativa o WhatsApp oficial.                                |
| `WHATSAPP_PHONE_ID`     | não         | Phone Number ID do WhatsApp Business.                                                                      |
| `WHATSAPP_VERIFY_TOKEN` | não         | Token que você escolhe para a Meta validar o webhook (`GET /webhooks/whatsapp`).                           |
| `WHATSAPP_APP_SECRET`   | não         | Se definido, valida a assinatura `X-Hub-Signature-256` dos webhooks.                                       |
| `PORT`                  | não         | Porta HTTP (padrão `3333`).                                                                                |
| `PUBLIC_API_URL`        | não         | URL pública da API, usada no `icsUrl`. Sem ela, a URL vem do host da requisição.                           |
| `REMINDER_HOUR`         | não         | Hora (fuso de SP) a partir da qual o cron manda os lembretes da véspera. Padrão: `17`.                     |
| `LOG_LEVEL`             | não         | Nível de log do pino (padrão `info`).                                                                      |

---

## Deploy: Render ou Railway com Postgres da Neon

### 1. Banco na Neon

1. Crie um projeto em [neon.tech](https://neon.tech) (região `sa-east-1`, São Paulo).
2. Copie a **connection string direta**, sem `-pooler` no host. Ela fica assim: `postgresql://usuario:senha@ep-xxxx.sa-east-1.aws.neon.tech/neondb?sslmode=require`.
   A conexão direta é a mais simples para o Prisma, porque as migrations e as transações interativas funcionam sem ajustes. Se quiser usar a URL com pooler, acrescente `&pgbouncer=true`.

Na Supabase é igual: use a connection string "Direct connection" (porta 5432).

### 2a. Render

1. **New → Web Service** e conecte o repositório.
2. Configure:
   - **Runtime:** Node
   - **Build Command:** `npm ci --include=dev && npm run build && npm run db:deploy`
   - **Start Command:** `npm start`
   - **Environment:** `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL=https://seu-front.vercel.app`, `DEMO_MODE=true` e, se quiser, `PUBLIC_API_URL=https://sua-api.onrender.com`.
3. Depois do primeiro deploy, rode o seed uma vez pelo **Shell** do Render: `npm run db:seed`.
4. No plano gratuito o serviço "dorme". Abra a URL alguns minutos antes da apresentação.

### 2b. Railway

1. **New Project → Deploy from GitHub repo**.
2. Em **Variables**, defina as mesmas variáveis do Render.
3. Em **Settings → Deploy**:
   - **Build Command:** `npm run build && npm run db:deploy`
   - **Start Command:** `npm start`
4. Rode o seed uma vez: `railway run npm run db:seed`, ou pelo terminal do serviço.

### Cookies entre domínios

Com `NODE_ENV=production`, o cookie de sessão sai com `SameSite=None; Secure`, necessário quando o front (Vercel) e a API (Render) estão em domínios diferentes. No front, faça as chamadas com `credentials: 'include'` e abra o SSE com `new EventSource(url, { withCredentials: true })`.
Se o navegador bloquear cookies de terceiros, use o `token` devolvido no login: `Authorization: Bearer <token>`, ou `?token=` no `/events`.

---

## Contrato da API

Tudo é JSON, com datas em ISO 8601 UTC. O front converte para `America/Sao_Paulo`.
Os erros seguem sempre o formato `{ "error": { "code", "message" } }`, com mensagem em pt-BR. Erros de validação trazem também `details`.

Os ids do seed são fixos, o que facilita o front e o `requests.http`:

- médicos: `doc_fernando`, `doc_helena`, `doc_rafael`;
- serviços: o próprio slug (`consulta-oftalmologica`, `catarata`, `ceratocone-crosslink`…);
- convênios: `ins_a` a `ins_d` e `ins_particular`. Particular também pode ir como `insuranceId: null`.

### Público (paciente)

| Método e rota                                                              | Retorno                                                          |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `GET /public/clinic`                                                       | dados da clínica                                                 |
| `GET /public/services`                                                     | serviços com `doctorIds`                                         |
| `GET /public/doctors?serviceId=`                                           | médicos (com `serviceIds`)                                       |
| `GET /public/insurances`                                                   | convênios ("Particular" por último)                              |
| `GET /public/availability?doctorId=&serviceId=&from=YYYY-MM-DD&days=14`    | `[{ date, slots: ["2026-10-20T11:00:00Z", …] }]`, só dias úteis  |
| `POST /public/appointments`                                                | `201 { appointment, icsUrl }` ou `409 { error: SLOT_TAKEN, slots }` |
| `GET /public/appointments/:id`                                             | `{ appointment, icsUrl }` (para a tela de remarcar)              |
| `GET /public/appointments/:id/ics`                                         | arquivo `.ics` (RFC 5545, com alarmes de 1 dia e 2 h antes)      |
| `POST /public/appointments/:id/reschedule` `{ start }`                     | `{ appointment, icsUrl }` ou `409 SLOT_TAKEN`                    |
| `GET /public/whatsapp/:phone`                                              | `{ patient, messages }` em ordem cronológica                     |
| `POST /public/whatsapp/:phone/reply` `{ messageId, buttonId }`             | resultado da ação (veja abaixo)                                  |

O telefone aceita vários formatos (`+5515991234567`, `15991234567`, `(15) 99123-4567`) e é guardado em E.164.

Os `buttonId` aceitos são:

- `CONFIRM`: a consulta vira `CONFIRMED` e a resposta traz `{ action: 'CONFIRMED', appointment }`.
- `RESCHEDULE`: a resposta traz `{ action: 'RESCHEDULE', rescheduleUrl: '/agendar?remarcar={id}' }`.
- `OK`, `DOUBT` e `PAIN`: valem para o pós-operatório. `DOUBT` e `PAIN` criam um alerta e a resposta traz `{ action, journey, alert }`.

### Autenticação

`POST /auth/login` `{ email, password }` grava o cookie httpOnly `mutton_session` e devolve `{ user, token }`. Há também `POST /auth/logout` e `GET /auth/me`.

### Painel (exige login)

| Método e rota                                     | Observações                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------------ |
| `GET /admin/metrics?date=`                        | `{ today, confirmed, awaitingReply, confirmationRate, noShowsAvoidedMonth, deltas }` |
| `GET /admin/agenda?date=&doctorId=`               | `{ date, appointments[], blocks[] }` com paciente, serviço, médico e convênio  |
| `PATCH /admin/appointments/:id`                   | `{ status }` ou `{ start, doctorId? }` (remarcar ou arrastar)                  |
| `GET /admin/journeys` · `GET /admin/journeys/:id` | o detalhe inclui etapas, alertas e mensagens                                   |
| `POST /admin/journeys/:id/advance`                | avança o `simulatedNow` até a próxima etapa e envia a mensagem                 |
| `GET /admin/alerts?open=true`                     | alertas com paciente e jornada                                                 |
| `POST /admin/alerts/:id/resolve`                  | grava `resolvedBy` com o nome de quem está logado                              |
| `GET /admin/reports?days=30`                      | `{ byChannel, byInsurance, confirmationRateByWeek, noShowsAvoidedByWeek }`     |
| `GET/PUT /admin/doctors/:id/working-hours`        | o `PUT` substitui a lista inteira                                              |
| `GET /admin/blocks` · `POST /admin/blocks` · `DELETE /admin/blocks/:id` | sem `doctorId`, o bloqueio vale para a clínica toda; o `POST` informa quantos agendamentos ativos caem no bloqueio |
| `GET /admin/doctors` · `GET /admin/patients/:id/messages` | apoio ao painel                                                        |

### Demo (só com `DEMO_MODE=true`)

- `POST /demo/send-reminders`: lembrete da véspera para os agendamentos de amanhã que ainda não receberam.
- `POST /demo/simulate-reply`: uma paciente aleatória responde a uma mensagem pendente. Consultas: 80% confirmam e 20% remarcam. Pós-op: 60% "estou bem", 25% dúvida e 15% dor.
- `POST /demo/random-appointments?count=5`: cria agendamentos aleatórios nos próximos 7 dias.
- `POST /demo/reset`: refaz o seed completo.

### Tempo real (SSE)

`GET /events` exige login, por cookie ou `?token=`, porque o stream carrega nomes de pacientes (LGPD).

Cada evento chega com `event: <tipo>` e `data: { type, payload, at }`. Há um heartbeat (comentário SSE) a cada 20 s.

Tipos de evento: `appointment.created`, `appointment.updated`, `message.created`, `journey.updated`, `alert.created`, `alert.resolved`. Existem também dois extras: `message.updated` (status vindo da Meta) e `demo.reset`.

```js
const es = new EventSource(`${API}/events`, { withCredentials: true });
es.addEventListener('appointment.created', (e) => {
  const { payload } = JSON.parse(e.data);
  // payload.appointment
});
```

---

## Regras de negócio

- **Disponibilidade:** horários de 20 em 20 min dentro do `WorkingHours` do médico, só em dias úteis, no fuso `America/Sao_Paulo`. Ficam de fora:
  - o intervalo de almoço;
  - os bloqueios do médico e da clínica;
  - os agendamentos ativos;
  - o passado.

  Um serviço de 40 min precisa de dois horários seguidos livres.
- **Sem agendamento duplo:** a proteção tem duas camadas.
  1. A transação trava a linha do médico com `SELECT … FOR UPDATE`, revalida o horário e só então grava. Pedidos simultâneos para o mesmo médico entram em fila.
  2. Um **índice único parcial** em `(doctorId, start)` para os status ativos (`PENDING`, `CONFIRMED`, `RESCHEDULED`, `DONE`) segura qualquer caso que escape. Uma violação desse índice também vira `409 SLOT_TAKEN`.
- **Criar:** cria a paciente ou reaproveita a que já tem o mesmo telefone. O agendamento nasce `PENDING` e `SITE`. Depois, a API envia a mensagem de confirmação com botões e publica `appointment.created` e `message.created`.
- **Remarcar:** valida o novo horário, libera o antigo e muda o status para `RESCHEDULED` e depois `PENDING`, zerando confirmação e lembrete. Por fim, envia a nova mensagem.
- **Cancelar pelo painel:** envia uma mensagem avisando a paciente.
- **Lembrete da véspera:** o cron roda a cada minuto e, a partir de `REMINDER_HOUR` (17h), lembra os agendamentos de amanhã que ainda não receberam lembrete. Antes desse horário, o lembrete só sai pelo botão da demo, o que deixa o fluxo intacto para a apresentação.
- **Faltas evitadas:** um agendamento conta como falta evitada quando a paciente responde (confirma ou remarca) **depois do lembrete**. O momento fica gravado em `noShowAvoidedAt`.
- **Jornada cirúrgica:** as etapas são D-7, D-1, Dia, D+1, 1º retorno (D+7) e D+30.
  - `advance` move o `simulatedNow` para a próxima etapa, marca `sentAt` e envia a mensagem. No D+1, a mensagem traz os botões Estou bem, Tenho uma dúvida e Sinto dor.
  - `PAIN` gera um alerta `POST_OP_PAIN` e `DOUBT` gera um `POST_OP_DOUBT`.
- **Métricas:** os `deltas` de `today`, `confirmed` e `awaitingReply` comparam com o mesmo dia da semana anterior. O delta de `noShowsAvoidedMonth` compara os últimos 7 dias com os 7 anteriores (o campo `deltaBasis` explica isso na própria resposta).
- **Templates:** ficam em [`src/templates.ts`](./src/templates.ts), em pt-BR e com as variáveis `{nome}`, `{serviço}`, `{médico}`, `{dia}`, `{data}` e `{hora}`. Os textos de pós-operatório trazem a nota de que, na versão final, o texto é escrito pela equipe médica.

## WhatsApp

`src/whatsapp/index.ts` expõe `sendMessage({ to, body, buttons? })` com duas implementações:

1. **Simulada** (padrão): grava em `Message` e publica `message.created`. A "tela de celular" do front lê `GET /public/whatsapp/:phone`.
2. **Meta Cloud API:** é ativada quando `WHATSAPP_TOKEN` e `WHATSAPP_PHONE_ID` existem. Envia mensagens interativas com até 3 botões, e o id de cada botão vai como `<messageId>:<buttonId>`.
   - O webhook `POST /webhooks/whatsapp` recebe o toque e chama **o mesmo fluxo** da resposta simulada.
   - Os status (`sent`, `delivered`, `read`) atualizam a mensagem.
   - Texto livre fica gravado na conversa.

   Para configurar, cadastre `https://SUA-API/webhooks/whatsapp` no app da Meta com o `WHATSAPP_VERIFY_TOKEN` e assine o campo `messages`.

> Fora da janela de 24 h, a Meta só permite iniciar conversa com **template aprovado**. Para produção, os textos de confirmação e lembrete precisam ser cadastrados como templates. O beta usa mensagens interativas, que funcionam dentro da janela ou em números de teste.

## Seed

O seed usa números aleatórios com semente fixa e datas relativas ao dia em que roda:

- **Clínica:**
  - Dr. Fernando Mutton, mais dois médicos fictícios (Dra. Helena Barros, retina, e Dr. Rafael Toledo, plástica ocular e superfície ocular);
  - 10 serviços com ícones do lucide;
  - os convênios genéricos "Convênio A" a "D", mais Particular.
- **Horários:** o Dr. Fernando atende segunda, quarta e sexta (terça e quinta são dias de cirurgia). A Dra. Helena atende de segunda a quinta e o Dr. Rafael, de terça a sexta.
- **Próximas 3 semanas:** cerca de 60 agendamentos, mais concentrados perto de hoje, com status e canais variados.
  - Os de hoje já receberam o lembrete.
  - Os de amanhã **ainda não**, para a demo do lembrete.
  - Há bloqueios de feriado (por exemplo, 12/10) e um congresso do Dr. Rafael numa sexta.
- **Últimos 30 dias:** cerca de 450 atendimentos. A taxa de confirmação sobe de cerca de 50% para cerca de 90%, e as faltas caem semana a semana.
- **Pós-operatório:** 8 pacientes, um em cada etapa. Uma tem alerta de **dor aberto** e outra teve uma dúvida já resolvida.
- **Conversas de WhatsApp** coerentes com tudo isso.
- **Pacientes:** nomes brasileiros comuns e telefones fictícios `+55 15 9xxxx-xxxx`.

## Testes

```bash
npm test
```

Os testes usam o banco `mutton_test` (veja `.env.test`). Antes de rodar, o setup aplica as migrations e faz o seed. Eles cobrem:

- disponibilidade: grade, expediente, bloqueios e passado;
- **corrida** no mesmo horário: 2 pedidos (um 201 e um 409) e 5 pedidos (um 201 e quatro 409);
- confirmação e remarcação pelo WhatsApp, lembrete sem duplicar e falta evitada;
- jornada avançando até o D+1, resposta **dor**, alerta aberto e resolvido;
- webhook da Meta (verificação e botão), autenticação, métricas e relatórios.

## Estrutura

```
prisma/              schema e migrations (inclui o índice único parcial)
src/
  index.ts           sobe o servidor e o cron
  server.ts          Fastify, CORS, cookies e tratamento de erros
  templates.ts       textos das mensagens
  clinic.ts          dados da clínica
  routes/            public, auth, admin, demo, events (SSE), webhooks
  services/          availability, appointments, replies, journeys, reminders, metrics
  whatsapp/          interface + implementações simulada e Meta
  seed/              dados e gerador do seed
  lib/               tempo/fuso, telefone, .ics, eventos, auth, erros
tests/               Vitest + Supertest
requests.http        exemplos de todas as rotas
```
