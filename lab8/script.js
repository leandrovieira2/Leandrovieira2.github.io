// A. Estado e variáveis com referência de elementos do DOM
const URL_BASE = "https://deisishop.pw.deisi.ulusofona.pt";
const CHAVE_CESTO = "produtos-selecionados";

let todosProdutos = [];

if (!localStorage.getItem(CHAVE_CESTO)) {
  localStorage.setItem(CHAVE_CESTO, JSON.stringify([]));
}

const nodeProdutos = document.querySelector("#produtos > .lista");
const nodeCesto = document.querySelector("#cesto > .lista");
const nodeTotal = document.querySelector("#cesto .total span");
const nodeFiltro = document.querySelector("#filtro");
const nodeOrdenar = document.querySelector("#ordenar");
const nodePesquisa = document.querySelector("#pesquisa");
const nodeEstudante = document.querySelector("#estudante");
const nodeCupao = document.querySelector("#cupao");
const nodeComprar = document.querySelector("#comprar");
const nodeValorFinal = document.querySelector("#valor-final");
const nodeReferencia = document.querySelector("#referencia");

// B. Funções utilitárias
function lerCesto() {
  return JSON.parse(localStorage.getItem(CHAVE_CESTO));
}

function guardarCesto(lista) {
  localStorage.setItem(CHAVE_CESTO, JSON.stringify(lista));
}

function criarEstrelas(nota) {
  const cheias = Math.round(nota);
  return "★".repeat(cheias) + "☆".repeat(5 - cheias);
}

function criarProduto(produto) {
  const article = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = new URL(produto.image, URL_BASE).href;
  imagem.alt = produto.title;

  const preco = document.createElement("p");
  preco.textContent = `Custo total: ${Number(produto.price).toFixed(2)} €`;

  const rating = document.createElement("p");
  rating.textContent = `${produto.rating.rate} ${criarEstrelas(produto.rating.rate)} (${produto.rating.count} avaliações)`;

  const descricao = document.createElement("p");
  descricao.textContent = produto.description;

  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = "+ Adicionar ao Cesto";
  botao.addEventListener("click", () => {
    adicionarAoCesto(produto);
  });

  article.append(titulo, imagem, preco, rating, descricao, botao);
  return article;
}

function criaProdutoCesto(produto) {
  const article = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = new URL(produto.image, URL_BASE).href;
  imagem.alt = produto.title;

  const preco = document.createElement("p");
  preco.textContent = `Custo total: ${Number(produto.price).toFixed(2)} €`;

  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = "- Remover do Cesto";
  botao.addEventListener("click", () => {
    removerDoCesto(produto);
  });

  article.append(titulo, imagem, preco, botao);
  return article;
}

// C. Event handlers
async function carregarCategorias() {
  try {
    const resposta = await fetch(`${URL_BASE}/categories`);
    const categorias = await resposta.json();

    categorias.forEach((categoria) => {
      const opcao = document.createElement("option");
      opcao.value = categoria.name;
      opcao.textContent = categoria.name;
      nodeFiltro.append(opcao);
    });
  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro);
  }
}

async function carregarProdutos() {
  try {
    const resposta = await fetch(`${URL_BASE}/products`);

    if (!resposta.ok) {
      throw new Error(`erro ${resposta.status}`);
    }

    todosProdutos = await resposta.json();
    atualizaProdutos();
  } catch (erro) {
    nodeProdutos.textContent = `Não foi possível carregar os produtos (${erro.message}).`;
  }
}

function renderizarProdutos(produtos) {
  nodeProdutos.innerHTML = "";
  produtos.forEach((produto) => {
    nodeProdutos.append(criarProduto(produto));
  });
}

function atualizaProdutos() {
  const categoria = nodeFiltro.value;
  const texto = nodePesquisa.value.trim().toLowerCase();
  const ordem = nodeOrdenar.value;

  const lista = todosProdutos.filter((produto) => {
    const daCategoria = categoria === "" || produto.category === categoria;
    const doTexto = produto.title.toLowerCase().includes(texto);
    return daCategoria && doTexto;
  });

  if (ordem === "crescente") {
    lista.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (ordem === "decrescente") {
    lista.sort((a, b) => Number(b.price) - Number(a.price));
  }

  renderizarProdutos(lista);
}

function atualizaCesto() {
  const cesto = lerCesto();

  nodeCesto.innerHTML = "";
  cesto.forEach((produto) => {
    nodeCesto.append(criaProdutoCesto(produto));
  });

  const total = cesto.reduce((acc, produto) => acc + Number(produto.price), 0);
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

async function comprar() {
  const cesto = lerCesto();

  if (cesto.length === 0) {
    nodeValorFinal.textContent = "O cesto está vazio.";
    nodeReferencia.textContent = "";
    return;
  }

  const pedido = {
    products: cesto.map((produto) => produto.id),
    student: nodeEstudante.checked,
    coupon: nodeCupao.value.trim(),
    name: "",
  };

  try {
    const resposta = await fetch(`${URL_BASE}/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedido),
    });
    const dados = await resposta.json();

    if (!resposta.ok || dados.error) {
      nodeValorFinal.textContent = `Erro: ${dados.error}`;
      nodeReferencia.textContent = "";
      return;
    }

    nodeValorFinal.textContent = `Valor final a pagar (com eventuais descontos): ${dados.totalCost} €`;
    nodeReferencia.textContent = `Referência de pagamento: ${dados.reference}`;
  } catch (erro) {
    nodeValorFinal.textContent = `Erro: ${erro.message}`;
    nodeReferencia.textContent = "";
  }
}

// D. Event Listeners
nodeFiltro.addEventListener("change", atualizaProdutos);
nodeOrdenar.addEventListener("change", atualizaProdutos);
nodePesquisa.addEventListener("input", atualizaProdutos);
nodeComprar.addEventListener("click", comprar);

// E. Inicialização
carregarCategorias();
carregarProdutos();
atualizaCesto();
