# Projeto Encomenda/Pedido - Backend

Backend em **Node.js + TypeScript** para gestão de autenticação, catálogo de itens, carrinho, pedidos agendados, frete e dashboard administrativo.

> Este README foi escrito para avaliação técnica, com foco em **decisões arquiteturais e de engenharia** tomadas no projeto e o motivo de cada uma delas.

---

## 1) Objetivo técnico do projeto

O projeto foi estruturado para resolver um cenário real de e-commerce de alimentação com:

- regras de negócio de pedido (janela de horário, agendamento e status);
- autenticação com sessão baseada em cookies + JWT;
- integração com serviços externos (frete e e-mail);
- rastreabilidade operacional (logs + request id);
- capacidade de evolução para cenários com mais carga (Redis para rate limit e arquitetura em camadas).

A decisão central foi privilegiar **separação de responsabilidades**, pois isso melhora manutenção, testes e evolução do código.

---

## 2) Arquitetura em camadas e por que ela foi escolhida

A base foi organizada para evitar lógica de negócio espalhada em rotas/controladores e reduzir acoplamento com detalhes de infraestrutura.

### Camadas

- **`infra/server/routes`**: apenas definição de endpoints e composição de middlewares.
- **`controllers`**: fronteira HTTP (parse de entrada, chamada de serviço, status code de saída).
- **`service`**: regras de negócio (core da aplicação).
- **`repository/interfaces`**: contratos de persistência (abstração).
- **`repository/prisma`**: implementação real em banco.
- **`repository/in-memory`**: implementação para testes unitários.
- **`domain/dto` e `domain/model`**: contratos explícitos de entrada e saída.
- **`libs`**: componentes transversais (Prisma, Redis, logger e Resend).

### Decisão técnica

Essa estrutura foi escolhida para garantir:

1. **Testabilidade**: serviços são testados sem banco real usando repositórios in-memory.
2. **Troca de infraestrutura com baixo impacto**: contratos protegem a camada de negócio.
3. **Legibilidade**: cada pasta responde a um tipo de responsabilidade.
4. **Evolução segura**: facilita adicionar módulos sem “efeito dominó”.

---

## 3) Tipagem e validação de dados

### TypeScript em modo `strict`

A tipagem forte reduz erro de integração entre camadas e dá previsibilidade em refatorações.

### Zod nos DTOs

As entradas são validadas no limite da aplicação (controller), antes de atingir regra de negócio.

#### Motivos da escolha

- validação declarativa e centralizada;
- mensagens de erro consistentes;
- suporte a transformação de payload (ex.: string de data para `Date`);
- reduz risco de dados inválidos chegarem à camada de serviço.

---

## 4) Persistência e modelagem de domínio

### PostgreSQL + Prisma

Prisma foi escolhido por unir produtividade e segurança de tipos na camada de dados.

### Decisões de modelagem

- **`numeroPedido` autoincremental** em `Pedido`: melhora operação e comunicação com cliente.
- **Relação `Pedido` ↔ `Carrinho` com `carrinhoId` único**: impede múltiplos pedidos para o mesmo carrinho finalizado.
- **Separação `Item` e `ItemDescription`**: desacopla preço/variação de catálogo textual.
- **Tabela de `tokenResets` dedicada**: isola ciclo de recuperação de senha com status e expiração.
- **Campos de auditoria** (`createdAt`/`updatedAt`): essenciais para rastreio de mudanças.

### Consistência transacional

Em fluxos críticos (como criar pedido e finalizar carrinho), foi aplicada transação para preservar integridade de estado.

---

## 5) Segurança aplicada

### Autenticação

- Access token curto + refresh token longo.
- Ambos em cookie `httpOnly`.

**Motivo**: reduzir exposição de token ao JavaScript do cliente e equilibrar segurança com UX.

### Autorização por perfil

Controle explícito por papéis (`ADMIN` e `CLIENT`) via middleware dedicado.

**Motivo**: separar autenticação (quem é) de autorização (o que pode fazer), deixando a política de acesso clara.

### Hardening de API

- `helmet` para headers de segurança;
- `cors` parametrizado por ambiente;
- `express.json` com limite de payload.

---

## 6) Resiliência e governança de erro

Foi adotado um middleware global de erro com três trilhas:

1. **Erro de validação** (Zod) com retorno orientado a campo;
2. **Erro de persistência conhecido** (Prisma) traduzido para status HTTP adequado;
3. **Erro inesperado** com resposta genérica e log estruturado.

### Decisão técnica

Padronizar erro protege o contrato da API e evita vazamento de detalhes internos para o cliente.

---

## 7) Observabilidade e diagnóstico

### Stack de logs

- **Pino + pino-http** para logs performáticos e estruturados.
- **`requestId`** por requisição.
- **`AsyncLocalStorage`** para transportar contexto no ciclo completo.
- **Redaction** de campos sensíveis (senha/tokens/cookies).

### Motivo da escolha

Essa combinação melhora muito investigação de incidente, porque conecta logs de middleware, serviço e integração no mesmo contexto de request.

### Observabilidade externa

A stack opcional com **Alloy + Loki + Grafana** foi adicionada para centralização e consulta dos logs quando necessário.

---

## 8) Estratégia de proteção contra abuso

### Rate limiting com Redis

Rate limit foi implementado com store Redis para suportar execução em múltiplas instâncias.

- política específica para autenticação;
- política específica para recuperação de senha;
- política global para demais chamadas.

### Motivo da escolha

Com Redis, os contadores não ficam presos à memória de um único processo, mantendo o controle eficaz em escala horizontal.

---

## 9) Integrações externas e desacoplamento

### Serviço de frete

O cálculo de distância foi encapsulado em `IDistanceProvider` com implementação concreta no provider externo.

### Serviço de e-mail

A entrega de e-mail usa `IEmailService` e implementação com Resend + templates centralizados.

### Motivo da escolha

Interfaces isolam o domínio das integrações externas e reduzem custo de troca de fornecedor no futuro.

---

## 10) Comunicação em tempo real

Socket.IO foi adotado para atualizar status de pedidos em tempo real por sala de usuário.

### Motivo da escolha

Evita polling constante e melhora percepção de responsividade na experiência do cliente.

---

## 11) Testabilidade como decisão de arquitetura

O projeto não trata teste como etapa final, mas como requisito de desenho.

### Como isso aparece no código

- serviços dependem de interfaces;
- existem repositórios in-memory para testes unitários;
- testes de integração cobrem fluxo HTTP com banco real;
- CI valida lint, build e suíte de testes.

### Motivo da escolha

Essa estratégia reduz regressão em refatorações e acelera evolução com confiança.

---

## 12) Organização operacional do projeto

### Estrutura de execução

- desenvolvimento local com `ts-node-dev`;
- build para `dist` com TypeScript;
- Docker Compose para banco, Redis e stack opcional de observabilidade.

### Banco e ciclo de schema

- migrations versionadas em `prisma/migrations`;
- seed para dados iniciais.

### Motivo da escolha

Padronizar o fluxo operacional reduz atrito de onboarding e divergência entre ambientes.

---

## 13) Stack adotada

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Redis
- Zod
- JWT
- Pino
- Socket.IO
- Resend
- Jest + Supertest
- Docker Compose

---

## 14) Repositórios relacionados

Frontend oficial:  
https://github.com/Gabriell0610/Projeto_Encomenda_Pedido_Front
