# Gestor Financeiro Pessoal

Aplicação full-stack para controle financeiro pessoal (receitas, despesas, categorias, filtros, cores por categoria, cálculo de saldo e gráfico de pizza).

## Tecnologias Utilizadas

- **Frontend:** Angular (Angular CLI), TypeScript, `HttpClient`, `Chart.js`
- **Backend:** Node.js, Express, Mongoose, Dotenv, CORS
- **Banco de Dados:** MongoDB (Local ou MongoDB Atlas)

## Estrutura do Projeto

```text
gestor-financeiro/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── config/database.js
│       ├── models/Movimentacao.js
│       ├── controllers/movimentacaoController.js
│       └── routes/movimentacaoRoutes.js
└── frontend/
    └── src/app/
        ├── models/movimentacao.model.ts
        ├── services/movimentacao.service.ts
        ├── components/
        │   ├── resumo-financeiro/
        │   ├── movimentacao-form/
        │   ├── movimentacao-lista/
        │   └── grafico-categorias/
        └── app.ts / app.html / app.css
```

## Como Executar o Projeto

### 1. Configurar o Backend

1. Acesse a pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` baseado no `.env.example`:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/gestor-financeiro
   PORT=3000
   ```
   > **Dica (MongoDB Atlas):** se não tiver MongoDB instalado localmente, crie um cluster gratuito no [MongoDB Atlas](https://www.mongodb.com/atlas), libere seu IP em *Network Access* e cole a string `mongodb+srv://...` em `MONGO_URI`.
4. Inicie a API:
   ```bash
   npm run dev
   ```
   A API ficará disponível em `http://localhost:3000`.

### 2. Executar o Frontend (Angular)

1. Em outro terminal, acesse a pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
4. Acesse no navegador: `http://localhost:4200`.

## Endpoints da API REST

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/health` | Verifica se a API está ativa |
| `GET` | `/api/movimentacoes` | Lista movimentações (aceita `?categoria=` e `?tipo=`) |
| `GET` | `/api/movimentacoes/resumo` | Retorna total de receitas, despesas e saldo |
| `GET` | `/api/movimentacoes/:id` | Busca uma movimentação por ID |
| `POST` | `/api/movimentacoes` | Cria uma nova movimentação |
| `PUT` | `/api/movimentacoes/:id` | Atualiza uma movimentação existente |
| `DELETE` | `/api/movimentacoes/:id` | Remove uma movimentação |

## Roteiro Sugerido para a Apresentação (70% da nota)

1. **Problema e Solução:** dificuldade de acompanhar gastos diários e visualizar para onde vai o dinheiro; solução centralizada com registro de entradas/saídas, categorias coloridas, saldo automático e gráfico de pizza.
2. **Arquitetura (`Angular → API Node.js → MongoDB`):**
   - O **Angular** exibe os componentes e usa o `MovimentacaoService` (`HttpClient`) para enviar requisições HTTP (`GET`, `POST`, `PUT`, `DELETE`).
   - A **API Node.js (Express)** recebe as rotas, valida e executa as operações no **Controller**.
   - O **Mongoose** faz o mapeamento dos dados (`Schema`) e persiste no **MongoDB**, usando credenciais protegidas via `.env`.
3. **Demonstração ao Vivo:**
   - Cadastrar uma receita (ex.: Salário) e duas despesas de categorias diferentes (ex.: Alimentação e Transporte).
   - Mostrar o saldo atualizando e o gráfico de pizza mudando.
   - Filtrar por categoria e editar/excluir uma movimentação (recarregando a página para provar a persistência no MongoDB).
4. **Desafios e Aprendizados:**
   - Integração entre frontend e backend (CORS, verbos HTTP e status codes).
   - Organização em componentes e serviços no Angular.
   - Segurança de credenciais com `.env` e `.gitignore`.
