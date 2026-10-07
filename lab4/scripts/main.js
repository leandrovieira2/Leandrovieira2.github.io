// Referências guardadas uma única vez (boa prática de performance)
const fraseHover = document.getElementById('frase-hover');
const frasePintar = document.getElementById('frase-pintar');
const contadorEl = document.getElementById('contador');
const zonaMovimento = document.getElementById('zona-movimento');
const bolinha = document.getElementById('bolinha');
const inputCor = document.getElementById('input-cor');
const caixaMensagem = document.getElementById('caixa-mensagem');

let contador = 0;

// ---------- 1. mouseover / mouseout numa frase ----------
function mudarFrase() {
  fraseHover.textContent = 'Boa! Encontraste o texto escondido. 🎉';
  fraseHover.style.color = '#0071b8';
}

function restaurarFrase() {
  fraseHover.textContent = 'Passa o rato por cima desta frase...';
  fraseHover.style.color = '#333';
}

// ---------- 2. click — muda a cor de uma frase ----------
const coresAleatorias = ['#e63946', '#2a9d8f', '#f4a261', '#8338ec', '#ff006e'];

function pintarFrase() {
  const corEscolhida = coresAleatorias[Math.floor(Math.random() * coresAleatorias.length)];
  frasePintar.style.color = corEscolhida;
  frasePintar.style.fontWeight = 'bold';
}

// ---------- 3. click — contador ----------
function incrementarContador() {
  contador++;
  contadorEl.textContent = contador;
}

// ---------- 4. dblclick — reiniciar contador ----------
function reiniciarContador() {
  contador = 0;
  contadorEl.textContent = contador;
}

// ---------- 5. mousemove — bolinha segue o rato ----------
function seguirRato(event) {
  const limites = zonaMovimento.getBoundingClientRect();
  const x = event.clientX - limites.left;
  const y = event.clientY - limites.top;
  bolinha.style.left = `${x - 10}px`;
  bolinha.style.top = `${y - 10}px`;
}

// ---------- Extra: input de cor muda o fundo da página ----------
function mudarCorFundo() {
  const cor = inputCor.value.trim().toLowerCase();
  document.body.style.backgroundColor = cor;
}

// ---------- Extra: caixa de mensagem muda a sua própria cor ao escrever ----------
const coresCaixa = ['#ffe5d9', '#d8f3dc', '#cde7f0', '#fff3b0', '#e0bbff'];

function mudarCorCaixa() {
  if (caixaMensagem.value.length > 0) {
    const corAleatoria = coresCaixa[Math.floor(Math.random() * coresCaixa.length)];
    caixaMensagem.style.backgroundColor = corAleatoria;
  } else {
    caixaMensagem.style.backgroundColor = 'white';
  }
}
