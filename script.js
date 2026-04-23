const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const gameBoard = document.querySelector('.game-board');

const bgm = document.getElementById("bgm");
const jumpSound = document.getElementById("jumpSound");
const gameOverSound = document.getElementById("gameOverSound");
const pauseSound = document.getElementById("pauseSound");
const coinSound = document.getElementById("coinSound");

const pauseText = document.getElementById("pauseText");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const finalScore = document.getElementById("finalScore");

let musicaIniciada = false;
let jogoPausado = false;
let gameOverAtivo = false;
let jogoIniciado = false;

let score = 0;
let highScore = 0;
let scoreInterval;

const jump = () => {
  if (!jogoIniciado || jogoPausado || gameOverAtivo) return;
  if (mario.classList.contains('jump')) return;

  jumpSound.currentTime = 0;
  jumpSound.play().catch(() => {});

  mario.classList.add('jump');

  setTimeout(() => {
    mario.classList.remove('jump');
  }, 500);
};

function iniciarPontuacao() {
  clearInterval(scoreInterval);

  scoreInterval = setInterval(() => {
    if (!jogoPausado && !gameOverAtivo && jogoIniciado) {
      score++;
      scoreText.innerText = `Score: ${score}`;

      if (score > highScore) {
        highScore = score;
        highScoreText.innerText = `Recorde: ${highScore}`;
      }

      if (score > 0 && score % 100 === 0) {
        coinSound.currentTime = 0;
        coinSound.play().catch(() => {});
      }
    }
  }, 100);
}

function iniciarJogo() {
  if (jogoIniciado) return;

  jogoIniciado = true;
  musicaIniciada = true;
  jogoPausado = false;
  gameOverAtivo = false;
  score = 0;

  scoreText.innerText = `Score: ${score}`;
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  pauseText.classList.add('hidden');

  pipe.style.animation = 'pipe-animation 2s infinite linear';
  pipe.style.left = '';
  pipe.style.right = '';

  mario.style.animation = '';
  mario.style.bottom = '0px';
  mario.src = './images/mario.webp';
  mario.style.width = '150px';
  mario.style.marginLeft = '0px';
  mario.classList.remove('jump');

  bgm.loop = true;
  bgm.volume = 0.5;
  bgm.play().catch(() => {});

  iniciarPontuacao();
}

const gameOver = () => {
  gameOverAtivo = true;
  jogoIniciado = false;

  clearInterval(scoreInterval);

  bgm.pause();

  gameOverSound.currentTime = 0;
  gameOverSound.play().catch(() => {});

  finalScore.innerText = `Score final: ${score}`;
  gameOverScreen.classList.remove('hidden');
};

function togglePause() {
  if (!jogoIniciado || gameOverAtivo) return;

  jogoPausado = !jogoPausado;

  if (jogoPausado) {
    pauseText.classList.remove('hidden');
    bgm.pause();

    pauseSound.currentTime = 0;
    pauseSound.play().catch(() => {});

    gameBoard.classList.add('paused');
    mario.classList.remove('jump');
  } else {
    pauseText.classList.add('hidden');
    bgm.play().catch(() => {});
    gameBoard.classList.remove('paused');
  }
}

function reiniciarJogo() {
  clearInterval(scoreInterval);

  jogoIniciado = false;
  musicaIniciada = false;
  jogoPausado = false;
  gameOverAtivo = false;
  score = 0;

  scoreText.innerText = 'Score: 0';
  finalScore.innerText = 'Score final: 0';

  pipe.style.animation = '';
  pipe.style.left = '';
  pipe.style.right = '';

  mario.style.animation = '';
  mario.style.bottom = '0px';
  mario.src = './images/mario.webp';
  mario.style.width = '150px';
  mario.style.marginLeft = '0px';
  mario.classList.remove('jump');

  pauseText.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  gameBoard.classList.remove('paused');

  bgm.pause();
  bgm.currentTime = 0;
}

function loop() {
  if (!jogoPausado && !gameOverAtivo && jogoIniciado) {
    const marioRect = mario.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();

    const colidiu =
      marioRect.right > pipeRect.left + 10 &&
      marioRect.left < pipeRect.right - 10 &&
      marioRect.bottom > pipeRect.top + 10;

    if (colidiu) {
      const pipePosition = pipe.offsetLeft;
      const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

      pipe.style.animation = 'none';
      pipe.style.left = `${pipePosition}px`;

      mario.style.animation = 'none';
      mario.style.bottom = `${marioPosition}px`;

      mario.src = './images/game-over.png';
      mario.style.width = '75px';
      mario.style.marginLeft = '50px';

      gameOver();
      return;
    }
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  if (e.key === 'Enter') {
    iniciarJogo();
    return;
  }

  if (key === 'r') {
    reiniciarJogo();
    return;
  }

  if (key === 'p') {
    togglePause();
    return;
  }

  if (e.code === 'Space' || key === 'w' || key === 'arrowup') {
    e.preventDefault();
    jump();
  }
});