const palavras = [
  "casa", "gato", "bola", "amor", "sol", "lua", "paz", "flor", "livro", "peixe",
  "rua", "mesa", "pão", "mãe", "pai", "água", "fogo", "ar", "dia", "noite",
  "luz", "janela", "porta", "carro", "vaca", "pato", "mel", "rei", "vida", "vento",
  "areia", "lixo", "chão", "dedo", "pé", "copo", "sapato", "piso", "cama", "couro",
  "tempo", "nuvem", "olho", "dente", "boca", "nariz", "cabelo", "barco", "rio", "mar",
  "pente", "pato", "vivo", "morto", "vela", "barro", "pato", "panela", "pano", "cola",
  "cola", "pipa", "bicho", "urso", "leão", "tigre", "zebra", "cabra", "copo", "leite",
  "sal", "café", "sopa", "bolo", "ovo", "milho", "milha", "mato", "ninho", "pena", "asa",
  "mão", "pé", "teto", "telha", "grão", "fio", "rede", "teia", "rato", "vela", "pau", "giz",
  "estojo", "cola", "papel", "caneta", "livro", "página", "mala", "muro", "linha", "nuvem",
  "roda", "trilho", "avião", "ônibus", "trator", "navio", "pedra", "areia", "terra", "grama",
  "sola", "camisa", "jaqueta", "roupa", "meia", "brinco", "anel", "dado", "tampa", "banco", "bico"
];

let palavraSelecionada = "";
let letrasCorretas = [];
let letrasErradas = [];
let chancesRestantes = 6;
let tecladoAtivo = true;

const exibicaoPalavra = document.getElementById("word-display");
const exibicaoLetrasErradas = document.getElementById("wrong-letters");
const exibicaoChancesRestantes = document.getElementById("remaining-chances");
const containerBotoesLetras = document.getElementById("letter-buttons");
const exibicaoMensagem = document.getElementById("message");
const botaoReiniciar = document.getElementById("restart-button");
const dicaCategoria = document.getElementById("category-hint");

function escolherPalavraAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * palavras.length);
  palavraSelecionada = palavras[indiceAleatorio];
  dicaCategoria.textContent = "Categoria: Palavra local";
  atualizarExibicaoPalavra();
  atualizarExibicaoLetrasErradas();
  criarBotoesLetras();
}
escolherPalavraAleatoria();


function atualizarExibicaoPalavra() {
  const exibicao = palavraSelecionada
    .split("")
    .map(letra => (letrasCorretas.includes(letra) ? letra : "_"))
    .join(" ");
  exibicaoPalavra.textContent = exibicao;
}

function atualizarExibicaoLetrasErradas() {
  exibicaoLetrasErradas.textContent = letrasErradas.join(", ");
  exibicaoChancesRestantes.textContent = chancesRestantes;
}

function criarBotoesLetras() {
  containerBotoesLetras.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letra = String.fromCharCode(i).toLowerCase();
    const botao = document.createElement("button");
    botao.textContent = letra;
    botao.classList.add("letter-button");
    botao.setAttribute("data-letra", letra);
    botao.addEventListener("click", () => lidarCliqueLetra(letra, botao));
    containerBotoesLetras.appendChild(botao);
  }
}

function lidarCliqueLetra(letra, botao) {
  if (botao) botao.disabled = true;
  if (palavraSelecionada.includes(letra)) {
    if (!letrasCorretas.includes(letra)) {
      letrasCorretas.push(letra);
      atualizarExibicaoPalavra();
      verificarVitoria();
    }
  } else {
    if (!letrasErradas.includes(letra)) {
      letrasErradas.push(letra);
      chancesRestantes--;
      atualizarExibicaoLetrasErradas();
      verificarDerrota();
    }
  }
}

function verificarVitoria() {
  const conjuntoPalavra = new Set(palavraSelecionada.split(""));
  const conjuntoCorretas = new Set(letrasCorretas);
  if (conjuntoPalavra.size === conjuntoCorretas.size) {
    exibicaoMensagem.textContent = "Parabéns! Você venceu!";
    finalizarJogo();
  }
}

function verificarDerrota() {
  if (chancesRestantes <= 0) {
    exibicaoMensagem.textContent = `Você perdeu! A palavra era: ${palavraSelecionada}`;
    finalizarJogo();
  }
}

function finalizarJogo() {
  desativarTeclado();
  botaoReiniciar.style.display = "inline-block";
}

function reiniciarJogo() {
  letrasCorretas = [];
  letrasErradas = [];
  chancesRestantes = 6;
  exibicaoMensagem.textContent = "";
  botaoReiniciar.style.display = "none";
  tecladoAtivo = true;
  
  escolherPalavraAleatoria();
  atualizarExibicaoPalavra();
  atualizarExibicaoLetrasErradas();
  criarBotoesLetras();
}

function desativarTeclado() {
  tecladoAtivo = false;
  const botoes = document.querySelectorAll(".letter-button");
  botoes.forEach(botao => {
    botao.disabled = true;
  });
}

document.addEventListener("keydown", (event) => {
  if (!tecladoAtivo) return;
  const letra = event.key.toLowerCase();
  if (letra.match(/^[a-z]$/) && !letrasCorretas.includes(letra) && !letrasErradas.includes(letra)) {
    const botao = document.querySelector(`.letter-button:enabled[data-letra="${letra}"]`);
    if (botao) {
      botao.click();
    } else {
      lidarCliqueLetra(letra, null);
    }
  }
});

botaoReiniciar.addEventListener("click", reiniciarJogo);
reiniciarJogo();
