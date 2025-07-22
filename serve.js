const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('loja.db');

// Cria a tabela de produtos se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT UNIQUE NOT NULL,
    preco REAL NOT NULL,
    estoque INTEGER NOT NULL
  )
`);

// Rotas

// GET - lista todos os produtos
app.get('/produtos', (req, res) => {
  db.all('SELECT * FROM produtos', (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

// POST - adiciona produto
app.post('/produtos', (req, res) => {
  const { nome, preco, estoque } = req.body;
  db.run('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)', [nome, preco, estoque], function (err) {
    if (err) return res.status(400).json({ erro: err.message });
    res.json({ id: this.lastID });
  });
});

// PUT - edita produto
app.put('/produtos/:id', (req, res) => {
  const { nome, preco, estoque } = req.body;
  const { id } = req.params;
  db.run('UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?', [nome, preco, estoque, id], function (err) {
    if (err) return res.status(400).json({ erro: err.message });
    res.json({ atualizado: this.changes });
  });
});

// DELETE - remove produto
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM produtos WHERE id = ?', [id], function (err) {
    if (err) return res.status(400).json({ erro: err.message });
    res.json({ removido: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
