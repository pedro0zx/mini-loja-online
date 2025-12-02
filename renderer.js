  let produtos = [];
  let carrinho = [];

// ===== FUNÇÕES DE ARMAZENAMENTO LOCAL =====

// Carrega dados do localStorage
function carregarDados() {
  const produtosArmazenados = localStorage.getItem('produtos');
  const carrinhoArmazenado = localStorage.getItem('carrinho');

  if (produtosArmazenados) {
    produtos = JSON.parse(produtosArmazenados);
  }
  if (carrinhoArmazenado) {
    carrinho = JSON.parse(carrinhoArmazenado);
  }

  atualizarListaProdutos();
  atualizarCarrinho();
}

// Salva produtos no localStorage
function salvarProdutos() {
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Salva carrinho no localStorage
function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Limpa todo o armazenamento local
function limparArmazenamento() {
  localStorage.removeItem('produtos');
  localStorage.removeItem('carrinho');
  produtos = [];
  carrinho = [];
  atualizarListaProdutos();
  atualizarCarrinho();
}

// ===== FUNÇÕES DE PRODUTOS E CARRINHO =====

// Adiciona um produto ao cadastro
function adicionarProduto() {
  const nomeInput = document.getElementById('nome');
  const precoInput = document.getElementById('preco');
  const quantidadeInput = document.getElementById('quantidade-produto');

  const nome = nomeInput.value.trim();
  const preco = parseFloat(precoInput.value);
  const estoque = parseInt(quantidadeInput.value);

  if (!nome || isNaN(preco) || preco <= 0 || isNaN(estoque) || estoque < 1) {
    alert('Preencha os campos corretamente.');
    return;
  }

  // Verifica se o produto já existe (nome único)
  const existe = produtos.find(p => p.nome.toLowerCase() === nome.toLowerCase());
  if (existe) {
    alert('Produto já cadastrado!');
    return;
  }

  produtos.push({ nome, preco, estoque });
  nomeInput.value = '';
  precoInput.value = '';
  quantidadeInput.value = 1;

  atualizarListaProdutos();
  salvarProdutos();
}

// Atualiza lista de produtos cadastrados
function atualizarListaProdutos() {
  const lista = document.getElementById('lista-produtos');
  lista.innerHTML = '';

  produtos.forEach((produto, index) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <span><strong>${produto.nome}</strong> - R$${produto.preco.toFixed(2)} (Estoque: ${produto.estoque})</span>
      <div class="acoes">
        <button class="editar" onclick="editarProduto(${index})">✏️ Editar</button>
        <button class="remover" onclick="removerProduto(${index})">🗑️ Remover</button>
        <button class="adicionar-carrinho" onclick="adicionarAoCarrinho(${index})">➕ Adicionar ao Carrinho</button>
      </div>
    `;

    lista.appendChild(li);
  });
}

// Edita um produto (nome, preço, estoque)
function editarProduto(index) {
  const produto = produtos[index];
  const novoNome = prompt("Editar nome do produto:", produto.nome);
  if (novoNome === null) return;
  const novoPreco = prompt("Editar preço do produto:", produto.preco);
  if (novoPreco === null) return;
  const novoEstoque = prompt("Editar estoque do produto:", produto.estoque);
  if (novoEstoque === null) return;

  if (
    novoNome.trim() === "" ||
    isNaN(parseFloat(novoPreco)) ||
    parseFloat(novoPreco) <= 0 ||
    isNaN(parseInt(novoEstoque)) ||
    parseInt(novoEstoque) < 0
  ) {
    alert("Valores inválidos, edição cancelada.");
    return;
  }

  produto.nome = novoNome.trim();
  produto.preco = parseFloat(novoPreco);
  produto.estoque = parseInt(novoEstoque);

  atualizarListaProdutos();
  atualizarCarrinho();
  salvarProdutos();
}

// Remove produto (se não estiver no carrinho)
function removerProduto(index) {
  const produto = produtos[index];
  const noCarrinho = carrinho.find(item => item.nome === produto.nome);

  if (noCarrinho) {
    alert("Não é possível remover um produto que está no carrinho.");
    return;
  }

  produtos.splice(index, 1);
  atualizarListaProdutos();
  salvarProdutos();
}

// Adiciona produto ao carrinho (quantidade 1, respeitando estoque)
function adicionarAoCarrinho(index) {
  const produto = produtos[index];

  if (produto.estoque < 1) {
    alert("Produto sem estoque disponível!");
    return;
  }

  produto.estoque -= 1;

  const carrinhoIndex = carrinho.findIndex(item => item.nome === produto.nome);

  if (carrinhoIndex !== -1) {
    carrinho[carrinhoIndex].quantidade += 1;
  } else {
    carrinho.push({ nome: produto.nome, preco: produto.preco, quantidade: 1 });
  }

  atualizarListaProdutos();
  atualizarCarrinho();
  salvarProdutos();
  salvarCarrinho();
}

// Atualiza a lista do carrinho, com inputs para editar quantidade
function atualizarCarrinho() {
  const ul = document.getElementById('carrinho');
  const totalSpan = document.getElementById('total');
  const qtdSpan = document.getElementById('quantidade');

  ul.innerHTML = '';

  let total = 0;
  let totalItens = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = `${item.nome} - R$${item.preco.toFixed(2)}`;

    const inputQtd = document.createElement('input');
    inputQtd.type = 'number';
    inputQtd.min = 1;
    inputQtd.value = item.quantidade;
    inputQtd.addEventListener('change', (e) => {
      editarQuantidadeCarrinho(index, e.target.value);
    });

    const btnRemover = document.createElement('button');
    btnRemover.textContent = '❌ Remover';
    btnRemover.addEventListener('click', () => removerDoCarrinho(index));

    const divAcoes = document.createElement('div');
    divAcoes.className = 'acoes';
    divAcoes.appendChild(inputQtd);
    divAcoes.appendChild(btnRemover);

    li.appendChild(span);
    li.appendChild(divAcoes);

    ul.appendChild(li);

    total += item.preco * item.quantidade;
    totalItens += item.quantidade;
  });

  totalSpan.textContent = total.toFixed(2);
  qtdSpan.textContent = totalItens;
}

// Edita quantidade no carrinho e ajusta estoque do produto
function editarQuantidadeCarrinho(index, novaQtd) {
  novaQtd = parseInt(novaQtd);
  if (isNaN(novaQtd) || novaQtd < 1) {
    alert("Quantidade inválida");
    atualizarCarrinho();
    return;
  }

  const itemCarrinho = carrinho[index];
  const produto = produtos.find(p => p.nome === itemCarrinho.nome);

  if (!produto) {
    alert("Produto não encontrado");
    return;
  }

  const totalDisponivel = produto.estoque + itemCarrinho.quantidade;

  if (novaQtd > totalDisponivel) {
    alert(`Quantidade máxima disponível é ${totalDisponivel}`);
    atualizarCarrinho();
    return;
  }

  const diferenca = novaQtd - itemCarrinho.quantidade;
  produto.estoque -= diferenca;
  itemCarrinho.quantidade = novaQtd;

  atualizarListaProdutos();
  atualizarCarrinho();
  salvarProdutos();
  salvarCarrinho();
}

// Remove item do carrinho e repõe estoque
function removerDoCarrinho(index) {
  const item = carrinho[index];
  const produto = produtos.find(p => p.nome === item.nome);

  if (produto) {
    produto.estoque += item.quantidade;
  }

  carrinho.splice(index, 1);
  atualizarListaProdutos();
  atualizarCarrinho();
  salvarProdutos();
  salvarCarrinho();
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("O carrinho está vazio.");
    return;
  }

  // Calcula total e quantidade
  let total = 0;
  let totalItens = 0;
  carrinho.forEach(item => {
    total += item.preco * item.quantidade;
    totalItens += item.quantidade;
  });

  alert(`Compra finalizada!\nItens comprados: ${totalItens}\nTotal: R$${total.toFixed(2)}`);

  // Limpa o carrinho
  carrinho = [];

  atualizarCarrinho();
  atualizarListaProdutos();
  salvarProdutos();
  salvarCarrinho();
}

// Carrega dados ao abrir a página
document.addEventListener('DOMContentLoaded', carregarDados);

