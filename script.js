const palavrasPorTema = {
  frutas: [
    "abacate", "abacaxi", "acerola", "ameixa", "banana", "caju", "cereja", "figo", "framboesa", "goiaba",
    "graviola", "jabuticaba", "jaca", "kiwi", "laranja", "limão", "lichia", "maçã", "mamão", "manga",
    "maracujá", "melancia", "melão", "morango", "pera", "pêssego", "pitanga", "pitaya", "tamarindo",
    "uva", "cupuaçu", "cacau", "açaí", "ameixa", "carambola"
  ],
  objetos: [
    "cadeira", "mesa", "espelho", "caneta", "janela", "relógio", "mochila", "chave", "sofá", "lâmpada",
    "ventilador", "computador", "celular", "telefone", "controle", "panela", "garfo", "travesseiro", "óculos",
    "livro", "porta", "colher", "copo", "caneca", "caderno", "borracha", "tesoura", "régua", "estojo",
    "quadro", "gaveta", "armário", "escada", "tijolo", "prego", "martelo", "serrote", "furadeira", "fechadura"
  ],
  animais: [
    "gato", "cachorro", "elefante", "leão", "girafa", "zebra", "macaco", "tigre", "lobo", "coelho",
    "pinguim", "jacaré", "rinoceronte", "tatu", "ornitorrinco", "cervo", "águia", "coruja", "panda", "tubarão",
    "cavalo", "porco", "vaca", "onça", "suricato", "golfinho", "polvo", "camelo", "jacaré",
    "cobra", "sapo", "lagarto", "mariposa", "borboleta", "abelha", "formiga", "aranha", "pato", "galinha"
  ]
};

function removerAcentos(letra) {
  return letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


let palavraSelecionada = "";
let letrasCorretas = [];
let letrasErradas = [];
let chancesRestantes = 6;
let tecladoAtivo = true;
let temaSelecionado = "";

const exibicaoPalavra = document.getElementById("word-display");
const exibicaoLetrasErradas = document.getElementById("wrong-letters");
const exibicaoChancesRestantes = document.getElementById("remaining-chances");
const containerBotoesLetras = document.getElementById("letter-buttons");
const exibicaoMensagem = document.getElementById("message");
const hangmanImage = document.getElementById("hangman-image");
const botaoReiniciar = document.getElementById("restart-button");
const dicaCategoria = document.getElementById("category-hint");

function escolherPalavraAleatoria() {
  const lista = palavrasPorTema[temaSelecionado];
  const indiceAleatorio = Math.floor(Math.random() * lista.length);
  palavraSelecionada = lista[indiceAleatorio];
  dicaCategoria.textContent = `Categoria: ${temaSelecionado.charAt(0).toUpperCase() + temaSelecionado.slice(1)}`;
  atualizarExibicaoPalavra();
  atualizarExibicaoLetrasErradas();
  criarBotoesLetras();
}

function atualizarExibicaoPalavra(revelarTudo = false) {
  const exibicao = palavraSelecionada
    .split("")
    .map(letra => (letrasCorretas.includes(letra) || revelarTudo ? letra : "_"))
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

  const palavraNormalizada = removerAcentos(palavraSelecionada);
  const letraNormalizada = removerAcentos(letra);

  let acerto = false;

  for (let i = 0; i < palavraSelecionada.length; i++) {
    if (removerAcentos(palavraSelecionada[i]) === letraNormalizada) {
      acerto = true;
      if (!letrasCorretas.includes(palavraSelecionada[i])) {
        letrasCorretas.push(palavraSelecionada[i]);
      }
    }
  }

  if (acerto) {
    atualizarExibicaoPalavra();
    verificarVitoria();
  } else {
    if (!letrasErradas.includes(letra)) {
      letrasErradas.push(letra);
      chancesRestantes--;
      const erros = 6 - chancesRestantes;
      hangmanImage.src = `imgs/forca${erros}.png`;
      atualizarExibicaoLetrasErradas();
      verificarDerrota();
    }
  }
}


function verificarVitoria() {
  const letrasÚnicas = Array.from(new Set(palavraSelecionada.split("").filter(l => l !== " ")));
  const acertouTudo = letrasÚnicas.every(letra =>
    letrasCorretas.includes(letra)
  );

  if (acertouTudo) {
    exibicaoMensagem.textContent = "Parabéns! Você venceu!";
    hangmanImage.src = "imgs/forca6.png";
    finalizarJogo();
  }
}


function verificarDerrota() {
  if (chancesRestantes <= 0) {
    atualizarExibicaoPalavra(true); // revela a palavra
    exibicaoMensagem.textContent = `Você perdeu! A palavra era: ${palavraSelecionada}`;
    exibicaoMensagem.style.color = "red";
    hangmanImage.src = "imgs/forca7.png";
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
  hangmanImage.src = "imgs/forca0.png";

  escolherPalavraAleatoria();
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

// Seletor de tema
const botoesTema = document.querySelectorAll(".theme-button");
botoesTema.forEach(botao => {
  botao.addEventListener("click", () => {
    temaSelecionado = botao.dataset.tema;
    document.getElementById("theme-selection").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    reiniciarJogo();
  });
});
