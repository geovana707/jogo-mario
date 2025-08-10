const mario = document.getElementById('mario');
const obstaculos = document.getElementById('obstaculos');
const nuvens = document.getElementById('nuvens');
const btnIniciar = document.getElementById('btnIniciar');
const telaAbertura = document.getElementById('telaAbertura');
const telaFinal = document.getElementById('telaFinal');
const btnReiniciar = document.getElementById('btnReiniciar');
const scoreEl = document.getElementById('score');
const scoreFinalEl = document.getElementById('scoreFinal');
const moeda = document.getElementById('moeda');

let loop;             // loop colisão
let scoreInterval;    // contador score  
let score = 0;
let gameRunning = false;

let tiroAtivo = false;  // só um tiro por vez

function updateScoreDisplay() {
  scoreEl.textContent = score;
}

function pulo() {
  if (!gameRunning) return;
  if (mario.classList.contains('pulo')) return;
  mario.classList.add('pulo');
  setTimeout(() => mario.classList.remove('pulo'), 500);
}

function criarTiro() {
  if (tiroAtivo) return; // só um tiro por vez

  tiroAtivo = true;
  const tiro = document.createElement('div');
  tiro.classList.add('tiro');

  // Pega a altura atual do Mario e posiciona o tiro
  const marioBottom = window.getComputedStyle(mario).bottom;
  tiro.style.bottom = marioBottom;

  // Posiciona tiro um pouco à frente do Mario
  const marioLeft = mario.offsetLeft + 80; 
  tiro.style.left = marioLeft + 'px';

  document.querySelector('.jogo').appendChild(tiro);

  // Verifica colisão com a moeda a cada 20ms
  const intervaloColisao = setInterval(() => {
    const tiroRect = tiro.getBoundingClientRect();
    const moedaRect = moeda.getBoundingClientRect();

    if (
      tiroRect.left + tiroRect.width > moedaRect.left &&
      tiroRect.left < moedaRect.right &&
      tiroRect.top + tiroRect.height > moedaRect.top &&
      tiroRect.top < moedaRect.bottom &&
      moeda.style.opacity !== '0'
    ) {
      // Acertou a moeda!
      score += 100;
      updateScoreDisplay();

      moeda.style.opacity = '0';

      clearInterval(intervaloColisao);
      tiro.remove();
      tiroAtivo = false;

      // Moeda reaparece depois de 3 segundos
      setTimeout(() => {
        moeda.style.opacity = '1';
      }, 7000);
    }
  }, 20);

  // Anima o tiro para direita e some após 400ms
  tiro.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(350px)' }
    ],
    {
      duration: 400,
      fill: 'forwards',
      easing: 'linear',
    }
  );

  setTimeout(() => {
    if (tiro) tiro.remove();
    clearInterval(intervaloColisao);
    tiroAtivo = false;
  }, 400);
}

function iniciarJogo() {
  if (gameRunning) return;
  gameRunning = true;
  score = 0;
  updateScoreDisplay();

  telaAbertura.style.display = 'none';
  telaAbertura.setAttribute('aria-hidden','true');

  telaFinal.style.display = 'none';
  telaFinal.setAttribute('aria-hidden','true');

  obstaculos.style.animation = 'obstaculos 1s infinite linear';
  obstaculos.style.animationPlayState = 'running';

  nuvens.style.animation = 'nuvens 18s infinite linear';
  nuvens.style.animationPlayState = 'running';

  moeda.style.opacity = '1';

  loop = setInterval(() => {
    const tuboposi = obstaculos.offsetLeft;
    const marioposi = +window.getComputedStyle(mario).bottom.replace('px','');

    if (tuboposi <= 130 && tuboposi > 0 && marioposi < 100) {
      gameOver(tuboposi, marioposi);
    }
  }, 10);

  scoreInterval = setInterval(() => {
    score++;
    updateScoreDisplay();
  }, 150);
}

function gameOver(tuboposi, marioposi) {
  clearInterval(loop);
  clearInterval(scoreInterval);
  gameRunning = false;

  obstaculos.style.animationPlayState = 'paused';
  obstaculos.style.left = `${tuboposi}px`;

  nuvens.style.animationPlayState = 'paused';

  mario.classList.remove('pulo');
  mario.style.bottom = `${marioposi}px`;
  mario.style.animationPlayState = 'paused';

  mario.src = 'img/game-over.png';
  mario.style.width = '150px';
  mario.style.left = '10px';

  moeda.style.opacity = '0';

  scoreFinalEl.textContent = score;
  telaFinal.style.display = 'flex';
  telaFinal.setAttribute('aria-hidden','false');
}

function reiniciarJogo() {
  telaFinal.style.display = 'none';
  telaFinal.setAttribute('aria-hidden','true');

  mario.src = 'img/mario.gif';
  mario.style.width = '100px';
  mario.style.left = '50px';
  mario.style.bottom = '0';
  mario.style.animationPlayState = '';

  obstaculos.style.animation = 'none';
  obstaculos.offsetHeight; // reflow
  obstaculos.style.animation = 'obstaculos 1s infinite linear';
  obstaculos.style.animationPlayState = 'paused';
  obstaculos.style.left = '';

  nuvens.style.animation = 'none';
  nuvens.offsetHeight;
  nuvens.style.animation = 'nuvens 18s infinite linear';
  nuvens.style.animationPlayState = 'paused';

  moeda.style.opacity = '1';

  score = 0;
  updateScoreDisplay();

  setTimeout(iniciarJogo, 50);
}

btnIniciar.addEventListener('click', iniciarJogo);
btnReiniciar.addEventListener('click', reiniciarJogo);

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    if (!gameRunning && telaAbertura.style.display !== 'none') {
      iniciarJogo();
      return;
    }
    pulo();
  }
  if (e.key.toLowerCase() === 'z') {
    criarTiro();
  }
});
