/* global produtos */

// A. Estado e variáveis com referência de elementos do DOM
const CHAVE_CESTO = "produtos-selecionados";

if (!localStorage.getItem(CHAVE_CESTO)) {
  localStorage.setItem(CHAVE_CESTO, JSON.stringify([]));
}

const nodeProdutos = document.querySelector("#produtos > div");
const nodeCesto = document.querySelector("#cesto > div");
const nodeTotal = document.querySelector("#cesto p span");

// B. Funções utilitárias
function lerCesto() {
  return JSON.parse(localStorage.getItem(CHAVE_CESTO));
}

function guardarCesto(lista) {
  localStorage.setItem(CHAVE_CESTO, JSON.stringify(lista));
}

function criarProduto(produto) {
  const article = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;

  const descricao = document.createElement("p");
  descricao.textContent = produto.description;

  const preco = document.createElement("p");
  preco.textContent = `${produto.price.toFixed(2)} €`;

  const rating = document.createElement("p");
  rating.textContent = `Avaliação: ${produto.rating.rate} (${produto.rating.count})`;

  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = "+ Adicionar ao cesto";
  botao.addEventListener("click", () => {
    adicionarAoCesto(produto);
  });

  article.append(titulo, imagem, descricao, preco, rating, botao);
  return article;
}

function criaProdutoCesto(produto) {
  const article = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const preco = document.createElement("p");
  preco.textContent = `${produto.price.toFixed(2)} €`;

  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = "- Remover do cesto";
  botao.addEventListener("click", () => {
    removerDoCesto(produto);
  });

  article.append(titulo, preco, botao);
  return article;
}

// C. Event handlers
function renderizarProdutos(produtos) {
  produtos.forEach((produto) => {
    nodeProdutos.append(criarProduto(produto));
  });
}

function atualizaCesto() {
  const cesto = lerCesto();

  nodeCesto.innerHTML = "";
  cesto.forEach((produto) => {
    nodeCesto.append(criaProdutoCesto(produto));
  });

  const total = cesto.reduce((acc, produto) => acc + produto.price, 0);
  nodeTotal.textContent = total.toFixed(2);
}

function adicionarAoCesto(produto) {
  const cesto = lerCesto();
  cesto.push(produto);
  guardarCesto(cesto);
  atualizaCesto();
}

function removerDoCesto(produto) {
  const cesto = lerCesto();
  const indice = cesto.findIndex((p) => p.id === produto.id);

  if (indice !== -1) {
    cesto.splice(indice, 1);
    guardarCesto(cesto);
    atualizaCesto();
  }
}

// D. Event Listeners
// Os listeners dos botões são criados em criarProduto e criaProdutoCesto.

// E. Inicialização
renderizarProdutos(produtos);
atualizaCesto();
