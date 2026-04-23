# Produtos — Node + React + React Native

Monorepo de um sistema completo de gestão de produtos, desenvolvido como estudo e demonstração de um stack full-stack moderno.

O projeto consiste em uma API REST em Node.js + TypeScript + MySQL, um frontend web em React e um aplicativo mobile em React Native, todos consumindo o mesmo backend e operando sobre o mesmo domínio: CRUD de produtos com soft delete, validações de negócio e arquitetura em camadas.

## Motivação

Projeto desenvolvido por um desenvolvedor com background sólido em .NET e Angular, com o objetivo de explorar o ecossistema Node.js aplicando os mesmos padrões de arquitetura que utilizo no dia a dia (separação em camadas, DTOs, repository pattern, validação em service, tratamento consistente de erros). O resultado serve como referência pessoal e demonstração pública.

## Stack

### Backend (`apps/api`)
- Node.js 22 (LTS)
- TypeScript
- Express 5
- MySQL 8 via driver `mysql2` (queries parametrizadas, sem ORM)
- dotenv para variáveis de ambiente
- ts-node-dev para hot reload em desenvolvimento

### Frontend Web (`apps/web`)
- React
- TypeScript
- Vite
- *(a ser implementado)*

### Mobile (`apps/mobile`)
- React Native
- TypeScript
- Expo
- *(a ser implementado)*

## Arquitetura

O backend segue uma arquitetura em camadas inspirada nos princípios de Clean Architecture, com responsabilidades bem definidas:

```
Request
   ↓
Routes      → mapeia verbo + URL para o controller
   ↓
Controller  → trata HTTP (req/res, status codes), delega para service
   ↓
Service     → regras de negócio, validações, orquestração
   ↓
Repository  → acesso ao banco (queries SQL parametrizadas)
   ↓
MySQL
```

Cada camada depende apenas da camada imediatamente abaixo e não conhece detalhes de implementação das outras. O `Controller` não sabe SQL; o `Repository` não sabe HTTP.

## Estrutura do monorepo

```
produtos-node-react/
├── apps/
│   ├── api/              # Backend Node.js + Express + MySQL
│   │   ├── src/
│   │   │   ├── config/          # Conexão com banco, variáveis de ambiente
│   │   │   ├── controllers/     # Handlers HTTP
│   │   │   ├── routes/          # Definição de rotas Express
│   │   │   ├── services/        # Regras de negócio e validações
│   │   │   ├── repositories/    # Acesso ao banco (SQL)
│   │   │   ├── types/           # Interfaces e DTOs
│   │   │   └── server.ts        # Ponto de entrada
│   │   ├── .env                 # Não versionado
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── web/              # Frontend React (em desenvolvimento)
│   └── mobile/           # App React Native (em desenvolvimento)
├── .gitignore
└── README.md
```

## API — Endpoints

Base URL: `http://localhost:3000/api/produtos`

| Verbo | Rota | Descrição | Status de sucesso |
|---|---|---|---|
| `GET` | `/api/produtos` | Lista todos os produtos ativos | 200 |
| `GET` | `/api/produtos/:id` | Busca um produto por ID | 200 |
| `POST` | `/api/produtos` | Cria um novo produto | 201 |
| `PUT` | `/api/produtos/:id` | Atualiza um produto (aceita atualização parcial) | 200 |
| `DELETE` | `/api/produtos/:id` | Soft delete (marca `ativo = false`) | 204 |

### Exemplo — POST

Request:

```json
POST /api/produtos
{
  "nome": "Mouse Gamer Logitech G502",
  "descricao": "Mouse com 11 botões programáveis e RGB",
  "preco": 349.90,
  "estoque": 15
}
```

Response (201):

```json
{
  "id": 1,
  "nome": "Mouse Gamer Logitech G502",
  "descricao": "Mouse com 11 botões programáveis e RGB",
  "preco": "349.90",
  "estoque": 15,
  "ativo": 1,
  "criado_em": "2026-04-23T18:10:12.000Z",
  "atualizado_em": "2026-04-23T18:10:12.000Z"
}
```

### Códigos de erro

| Status | Quando |
|---|---|
| 400 | Erro de validação (nome vazio, preço negativo, body inválido) |
| 404 | Produto não encontrado ou soft-deletado |
| 500 | Erro interno não tratado |

## Modelagem de dados

Tabela `produtos`:

| Coluna | Tipo | Observação |
|---|---|---|
| `id` | `INT AUTO_INCREMENT` | Chave primária |
| `nome` | `VARCHAR(150)` | Obrigatório |
| `descricao` | `TEXT` | Opcional |
| `preco` | `DECIMAL(10, 2)` | Preserva precisão para valores monetários |
| `estoque` | `INT` | Default `0` |
| `ativo` | `BOOLEAN` | Flag de soft delete; default `TRUE` |
| `criado_em` | `TIMESTAMP` | Default `CURRENT_TIMESTAMP` |
| `atualizado_em` | `TIMESTAMP` | Atualizado automaticamente via `ON UPDATE CURRENT_TIMESTAMP` |

Estratégia de **soft delete**: operações de DELETE atualizam `ativo = FALSE` em vez de remover a linha. Queries de leitura filtram por `ativo = TRUE`. Isso preserva histórico para auditoria e permite reversão.

## Como rodar localmente

### Pré-requisitos

- Node.js 22 LTS
- MySQL 8.x rodando em `localhost:3306`
- npm (vem com o Node)

### Setup do banco

No MySQL Workbench ou em qualquer cliente, executar:

```sql
CREATE DATABASE crud_produtos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crud_produtos;

CREATE TABLE produtos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(150) NOT NULL,
  descricao     TEXT,
  preco         DECIMAL(10, 2) NOT NULL,
  estoque       INT NOT NULL DEFAULT 0,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Backend

```bash
cd apps/api
npm install
```

Criar um arquivo `.env` na pasta `apps/api/` com o conteúdo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=crud_produtos
```

Subir o servidor em modo desenvolvimento:

```bash
npm run dev
```

A API sobe em `http://localhost:3000`.

### Scripts disponíveis (backend)

| Script | Descrição |
|---|---|
| `npm run dev` | Roda em modo desenvolvimento com hot reload |
| `npm run dev:debug` | Roda em modo desenvolvimento com debugger na porta 9229 |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda a versão compilada |

## Roadmap

- [x] API REST com CRUD completo
- [x] Soft delete
- [x] Validações de negócio na camada de service
- [x] Update parcial (PATCH-like PUT)
- [ ] Frontend web em React + Vite
- [ ] App mobile em React Native + Expo
- [ ] Paginação e filtros no endpoint de listagem
- [ ] Autenticação JWT
- [ ] Tratamento centralizado de erros (middleware)
- [ ] Validação com biblioteca dedicada (Zod)
- [ ] Logging estruturado (Pino)
- [ ] Testes unitários (Jest) e de integração
- [ ] Documentação da API com OpenAPI/Swagger
- [ ] Dockerização (API + MySQL via Docker Compose)
- [ ] CI/CD com GitHub Actions

## Autor

**Gabriel Straube** — Desenvolvedor/Arquiteto .NET sênior explorando o ecossistema Node.js.
