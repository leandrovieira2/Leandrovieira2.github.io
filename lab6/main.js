// A. declaração de variáveis
const nodeInputNumero = document.querySelector(
  "#colecao + section input[type=number]",
);
const nodeInputSubmit = document.querySelector(
  "#colecao + section button[type=submit]",
);
const nodeUlColecao = document.querySelector("#colecao > ul");
const nodeSpanTotal = document.querySelector("#colecao h3 span");
const nodeUlRepetidos = document.querySelector("#repetidos > ul");
const nodeSpanRepetidos = document.querySelector("#repetidos h3 span");
const form = nodeInputSubmit.form;

const colecao = JSON.parse(localStorage.getItem("colecao")) ?? [];
const repetidos = JSON.parse(localStorage.getItem("repetidos")) ?? [];

// B. event handlers
function guardaStorage() {
  localStorage.setItem("colecao", JSON.stringify(colecao));
  localStorage.setItem("repetidos", JSON.stringify(repetidos));
}

function atualizaTotais() {
  nodeSpanTotal.textContent = colecao.length;
  nodeSpanRepetidos.textContent = repetidos.length;
}

function atualizaLista(lista, nodeUl) {
  nodeUl.innerHTML = "";
  lista.forEach((numero, indice) => {
    if (lista === repetidos) {
      nodeUl.innerHTML += `<li>${numero} <button type="button" class="eliminar" data-indice="${indice}">Eliminar</button></li>`;
    } else {
      nodeUl.innerHTML += `<li>${numero}</li>`;
    }
  });
  if (lista === repetidos) {
    ligaBotoesEliminar();
  }
}

function guardaCarta() {
  const numero = Number(nodeInputNumero.value);

  if (colecao.includes(numero)) {
    repetidos.push(numero);
    repetidos.sort((a, b) => a - b);
  } else {
    colecao.push(numero);
    colecao.sort((a, b) => a - b);
  }

  atualizaLista(colecao, nodeUlColecao);
  atualizaLista(repetidos, nodeUlRepetidos);
  atualizaTotais();
  guardaStorage();

  nodeInputNumero.value = "";
  nodeInputNumero.focus();
}

function eliminaRepetido(indice) {
  repetidos.splice(indice, 1);
  atualizaLista(repetidos, nodeUlRepetidos);
  atualizaTotais();
  guardaStorage();
}

// C. event listeners
form.onsubmit = (event) => {
  event.preventDefault();
  guardaCarta();
};

function ligaBotoesEliminar() {
  document.querySelectorAll("#repetidos button.eliminar").forEach((botao) => {
    botao.addEventListener("click", () => {
      eliminaRepetido(Number(botao.dataset.indice));
    });
  });
}

// D. ao carregar a página
atualizaLista(colecao, nodeUlColecao);
atualizaLista(repetidos, nodeUlRepetidos);
atualizaTotais();
