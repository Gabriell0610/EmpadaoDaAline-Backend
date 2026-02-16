# Logging e Observabilidade

Este projeto foi configurado para usar logs estruturados sem custo de licenca, com suporte para ambiente local e PRD self-hosted.

## Stack adotada

- Aplicacao: `pino` + `pino-http`
- Coleta: `Grafana Alloy`
- Armazenamento: `Loki`
- Visualizacao: `Grafana`

## O que foi implementado

### 1) Logger estruturado no backend

Arquivos criados:

- `src/libs/logger/logger.ts`
- `src/libs/logger/http-logger.ts`
- `src/libs/logger/request-context.ts`
- `src/libs/logger/index.ts`

Principais configuracoes:

- Formato JSON em producao
- `pino-pretty` em desenvolvimento
- Correlacao por `requestId` (cabecalho `x-request-id` ou UUID gerado)
- Redaction de campos sensiveis (`password`, `token`, `authorization`, `cookie`, etc.)

### 2) Instrumentacao nos pontos criticos

- Bootstrap do servidor: `src/infra/server/index.ts`
- Pipeline HTTP global: `src/infra/server/app.ts`
- Erro global: `src/middlewares/error/error-handler-middleware.ts`
- Autenticacao JWT: `src/middlewares/authentication/authentication-token.ts`
- Redis: `src/libs/redis/redis.ts`
- Socket.IO: `src/infra/socket/socket.ts`
- Fluxo de autenticacao: `src/service/auth/auth.service.ts`
- Fluxo de pedidos: `src/service/order/Order.service.ts`
- Provider externo de distancia/frete: `src/provider/DistanceProvider.ts`

Tambem foram removidos logs de debug com `console.log` em arquivos de servico/utilitarios que geravam ruido.

### 3) Tipagem de request

Arquivo alterado:

- `src/types/express/index.d.ts`

Campos adicionados:

- `requestId?: string`
- `log: Logger`

## Docker: local e PRD

Arquivo alterado:

- `docker-compose.yaml`

Servicos existentes mantidos:

- `database`
- `redis`

Servicos adicionados:

- `backend` (profile `app`)
- `loki` (profile `observability`)
- `grafana` (profile `observability`)
- `alloy` (profile `observability`)

Arquivos de configuracao:

- `observability/loki/loki-config.yaml`
- `observability/alloy/config.alloy`
- `observability/grafana/provisioning/datasources/loki.yaml`

## Scripts adicionados

Em `package.json`:

- `docker:observability:up`
- `docker:app:up`
- `docker:stack:up`
- `docker:stack:down`

## Como subir

### Opcao A: somente banco + redis (fluxo atual)

```bash
npm run docker:up
```

### Opcao B: observabilidade (Loki + Grafana + Alloy)

```bash
npm run docker:observability:up
```

Grafana: `http://localhost:3001`

- Usuario: `admin`
- Senha: `admin`

### Opcao C: stack completa (app + observabilidade)

```bash
npm run docker:stack:up
```

## Como os logs ficam correlacionados

1. `pino-http` cria/recebe `requestId`.
2. O backend devolve `x-request-id` na resposta.
3. Logs aplicacionais incluem o mesmo `requestId` via `AsyncLocalStorage`.
4. Alloy coleta logs do container `backend` e envia para Loki.
5. No Grafana, voce filtra por `requestId` para rastrear o fluxo inteiro.

## Consultas uteis no Grafana (LogQL)

Todos os logs do backend:

```logql
{service="backend"}
```

Somente erros:

```logql
{service="backend"} |= "level=error"
```

Por request especifico:

```logql
{service="backend"} |= "requestId=SEU_REQUEST_ID"
```

## Variaveis de ambiente

Foram adicionadas:

- `.env`
  - `LOG_LEVEL=debug`
  - `SERVICE_NAME=pedido-backend`
- `.env.docker`
  - `REDIS_URL=redis://redis:6379`
  - `LOG_LEVEL=info`
  - `SERVICE_NAME=pedido-backend`

## Observacoes para PRD

- Trocar a senha padrao do Grafana (`GF_SECURITY_ADMIN_PASSWORD`).
- Ajustar `LOG_LEVEL=info` ou `warn`.
- Ajustar retencao do Loki em `observability/loki/loki-config.yaml` (`retention_period`).
- Manter containers em volume persistente para nao perder historico de logs.
- Recomendado usar reverse proxy com autenticacao para Grafana.
