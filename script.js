/* Lista de palavras para o jogo */
const palavras = [
  "javascript",
  "programacao",
  "computador",
  "desenvolvedor",
  "internet",
  "tecnologia",
  "software",
  "hardware",
  "algoritmo",
  "interface"
];

let palavraSelecionada = "";
let letrasCorretas = [];
let letrasErradas = [];
let chancesRestantes = 6;
let usarApi = true;

const exibicaoPalavra = document.getElementById("word-display");
const exibicaoLetrasErradas = document.getElementById("wrong-letters");
const exibicaoChancesRestantes = document.getElementById("remaining-chances");
const containerBotoesLetras = document.getElementById("letter-buttons");
const exibicaoMensagem = document.getElementById("message");
const botaoReiniciar = document.getElementById("restart-button");
const dicaCategoria = document.getElementById("category-hint");

// Função para escolher uma palavra aleatória do array local
function escolherPalavraAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * palavras.length);
  palavraSelecionada = palavras[indiceAleatorio];
  dicaCategoria.textContent = "Categoria: Palavra local";
  atualizarExibicaoPalavra();
  atualizarExibicaoLetrasErradas();
  criarBotoesLetras();
}

// Função para buscar palavra da API
async function buscarPalavraDaApi() {
  try {
    const resposta = await fetch("https://random-word-api.herokuapp.com/word?lang=pt-br");
    const dados = await resposta.json();
    if (dados && dados.length > 0) {
      palavraSelecionada = dados[0].toLowerCase();
      dicaCategoria.textContent = "Categoria: Palavra aleatória da API";
      atualizarExibicaoPalavra();
      atualizarExibicaoLetrasErradas();
      criarBotoesLetras();
    } else {
      usarApi = false;
      escolherPalavraAleatoria();
    }
  } catch (erro) {
    console.error("Erro ao buscar palavra da API:", erro);
    usarApi = false;
    escolherPalavraAleatoria();
  }
}

// Função para atualizar a exibição da palavra com letras corretas
function atualizarExibicaoPalavra() {
  const exibicao = palavraSelecionada
    .split("")
    .map(letra => (letrasCorretas.includes(letra) ? letra : "_"))
    .join(" ");
  exibicaoPalavra.textContent = exibicao;
}

// Função para atualizar a exibição das letras erradas
function atualizarExibicaoLetrasErradas() {
  exibicaoLetrasErradas.textContent = letrasErradas.join(", ");
  exibicaoChancesRestantes.textContent = chancesRestantes;
}

// Função para criar os botões das letras
function criarBotoesLetras() {
  containerBotoesLetras.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letra = String.fromCharCode(i).toLowerCase();
    const botao = document.createElement("button");
    botao.textContent = letra;
    botao.classList.add("letter-button");
    botao.addEventListener("click", () => lidarCliqueLetra(letra, botao));
    containerBotoesLetras.appendChild(botao);
  }
}

// Função para lidar com o clique nas letras
function lidarCliqueLetra(letra, botao) {
  botao.disabled = true;
  if (palavraSelecionada.includes(letra)) {
    letrasCorretas.push(letra);
    atualizarExibicaoPalavra();
    verificarVitoria();
  } else {
    letrasErradas.push(letra);
    chancesRestantes--;
    atualizarExibicaoLetrasErradas();
    verificarDerrota();
  }
}

// Função para verificar se o jogador venceu
function verificarVitoria() {
  const conjuntoPalavra = new Set(palavraSelecionada.split(""));
  const conjuntoCorretas = new Set(letrasCorretas);
  if (conjuntoPalavra.size === conjuntoCorretas.size) {
    exibicaoMensagem.textContent = "Parabéns! Você venceu!";
    finalizarJogo();
  }
}

// Função para verificar se o jogador perdeu
function verificarDerrota() {
  if (chancesRestantes <= 0) {
    exibicaoMensagem.textContent = `Você perdeu! A palavra era: ${palavraSelecionada}`;
    finalizarJogo();
  }
}

// Função para finalizar o jogo
function finalizarJogo() {
  const botoes = document.querySelectorAll(".letter-button");
  botoes.forEach(botao => (botao.disabled = true));
  botaoReiniciar.style.display = "inline-block";
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  letrasCorretas = [];
  letrasErradas = [];
  chancesRestantes = 6;
  exibicaoMensagem.textContent = "";
  botaoReiniciar.style.display = "none";
  if (usarApi) {
    buscarPalavraDaApi();
  } else {
    escolherPalavraAleatoria();
  }
  atualizarExibicaoPalavra();
  atualizarExibicaoLetrasErradas();
  criarBotoesLetras();
}

// Inicialização do jogo
botaoReiniciar.addEventListener("click", reiniciarJogo);
reiniciarJogo();
