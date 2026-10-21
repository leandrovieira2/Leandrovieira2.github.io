const nodeInputNumero = document.querySelector(
  "#colecao + section input[type=number]",
);
const nodeInputSubmit = document.querySelector(
  "#colecao + section button[type=submit]",
);
const nodeUlColecao = document.querySelector("#colecao > ul");
const nodeSpanTotal = document.querySelector("#colecao h3 span");
const form = nodeInputSubmit.form;
const colecao = [];

function guardaCarta() {
  const numero = Number(nodeInputNumero.value);
  colecao.push(numero);
  colecao.sort((a, b) => a - b);
  atualizaLista(colecao, nodeUlColecao);
  nodeSpanTotal.textContent = colecao.length;
}

function atualizaLista(colecao, nodeUlColecao) {
  nodeUlColecao.innerHTML = "";
  colecao.forEach((numero) => {
    nodeUlColecao.innerHTML += `<li>${numero}</li>`;
  });
}

form.onsubmit = (event) => {
  event.preventDefault();
  guardaCarta();
};
