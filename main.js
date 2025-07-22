const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  // Banco de dados
  const dbPath = path.join(__dirname, 'loja.db');
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE,
        preco REAL,
        estoque INTEGER
      )
    `);
  });

  // Listar produtos
  ipcMain.handle('listar-produtos', async () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM produtos', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });

  // Adicionar produto
  ipcMain.handle('adicionar-produto', async (event, produto) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)',
        [produto.nome, produto.preco, produto.estoque],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  });

  // Editar produto
  ipcMain.handle('editar-produto', async (event, produto) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE produtos SET nome=?, preco=?, estoque=? WHERE id=?',
        [produto.nome, produto.preco, produto.estoque, produto.id],
        function (err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  });

  // Remover produto
  ipcMain.handle('remover-produto', async (event, id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM produtos WHERE id=?', [id], function (err) {
        if (err) reject(err);
        else resolve(true);
      });
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});