# Mini Loja Online

Mini Loja Online é uma aplicação desktop simples criada com Electron que simula o funcionamento de uma pequena loja — cadastrando produtos, adicionando itens ao carrinho e finalizando compras.

## ✅ Tecnologias usadas

- Electron — Aplicação desktop (frontend + processo principal Node.js).
- Node.js — Ambiente de execução (processo principal & servidor).
- Express — Servidor REST (arquivo `serve.js`).
- SQLite3 — Banco de dados leve para persistência (`loja.db` será criado automaticamente).
- HTML / CSS / JavaScript — UI e lógica do cliente (`index.html`, `style.css`, `renderer.js`).
- CORS, body-parser — Bibliotecas auxiliares no servidor.

## 🔍 Estrutura do projeto

- `index.html` — Interface principal da loja.
- `renderer.js` — Lógica do cliente (adicionar produto, editar, remover, carrinho, finalizar compra).
- `main.js` — Processo principal do Electron. Contém inicialização da janela e handlers do `ipcMain` para operações com SQLite.
- `serve.js` — Servidor REST em Express que expõe endpoints `GET/POST/PUT/DELETE /produtos`.
- `style.css` — Estilos da UI.
- `package.json` — Manifest do projeto com scripts e dependências.

## 📌 Observações importantes (análise do projeto)

- O projeto já contém suporte ao banco de dados via SQLite (`main.js` cria `loja.db`).
- O servidor REST (`serve.js`) também oferece os endpoints para CRUD de produtos.
- O `renderer.js` atual **não usa** o `ipcRenderer` nem faz requisições HTTP ao `serve.js` — a UI opera apenas em memória local (arrays `produtos` e `carrinho`).
- Há funcionalidades duplicadas/sem integração:
  - `main.js` implementa handlers do `ipcMain`, que seriam usados para persistência por meio de `ipcRenderer` no front, mas o front não chama essas rotas.
  - `serve.js` expõe uma API REST para persistência, mas o front também não consome essa API.
- **Script incorreto** em `package.json`: o script `server` aponta para `node backend/server.js`, que não existe no repositório. O arquivo correto é `serve.js` (na raiz). Recomenda-se atualizar o script para `node serve.js`.
- Segurança: `main.js` habilita `nodeIntegration: true` e `contextIsolation: false`. Em produção **não é recomendado** por motivos de segurança — considere usar `preload.js` e `contextIsolation: true`.

## ▶️ Pré-requisitos

- Node.js (>= 18 recomendado)
- NPM

## 🚀 Como executar o projeto (localmente)

1. Instalar dependências:

```powershell
npm install
```

2. Iniciar o servidor REST (opcional — se quiser usar a API do `serve.js`):

```powershell
node serve.js
```

> Observação: o `npm run server` não funcionará até você atualizar `package.json` (aponta para `backend/server.js` atualmente).

3. Abrir o aplicativo Electron (ou em outra janela do terminal):

```powershell
npm start
```

4. A UI abre e você pode adicionar produtos, editar, adicionar ao carrinho e finalizar compras.

## 🌟 Sugestões de melhoria

- Conectar o `renderer.js` ao `main.js` usando `ipcRenderer` para persistir os produtos no `loja.db` (use os canais `listar-produtos`, `adicionar-produto`, `editar-produto`, `remover-produto`).
- Como alternativa (ou complementar), conectar o front-end ao `serve.js` via `fetch`/axios para consumir a API REST.
- Corrigir o script `server` em `package.json` para: `"server": "node serve.js"`.
- Remover `nodeIntegration` em produção e usar um `preload.js` seguro com `contextIsolation: true`.
- Adicionar validação/handling de erros mais robusto (e melhor UX para erros do servidor).
- Adicionar testes unitários (e2e) e pipeline CI para builds.

## 🛠️ Scripts sugeridos

No `package.json` atual:

```json
{
  "scripts": {
    "start": "electron .",
    "server": "node backend/server.js"
  }
}
```

Sugestão para melhorias:

```json
{
  "scripts": {
    "start": "electron .",
    "server": "node serve.js",
    "start:dev": "concurrently \"node serve.js\" \"npm start\""
  }
}
```

> Use `npm i -D concurrently` para permitir rodar servidor + app simultaneamente em desenvolvimento.

## 📝 Notas finais

- O projeto é ótimo como base de um app desktop simples. Ele já tem elementos de persistência (SQLite), servidor REST e uma UI funcional.
- Eu posso: 1) ajustar o `package.json` para corrigir o script `server`; 2) conectar o `renderer.js` ao `main.js` ou a `serve.js` para persistência; 3) melhorar a segurança do Electron; 4) adicionar um `README.md` com badges, screenshots e instruções de deploy; 5) criar testes.

Se quiser, posso aplicar alguma dessas mudanças agora — qual você prefere que eu faça em seguida?

---

Licença: MIT (sugestão; altere conforme necessário).