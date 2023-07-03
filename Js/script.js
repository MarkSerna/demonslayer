// controles de volumen //

const audioButton = document.getElementById('audio-button');
const audioPlayer = document.getElementById('audio-player');
const volumeSlider = document.getElementById('volume-slider');
const audio = document.getElementById('audio');

function toggleAudio() {
    if (audioPlayer.style.visibility === 'hidden') {
        audioPlayer.style.visibility = 'visible';
    } else {
        audioPlayer.style.visibility = 'hidden';
    }
}

function changeVolume() {
    audio.volume = volumeSlider.value;
}

// Obtener una referencia al elemento de audio
const audioElement = document.getElementById("audio");

// Establecer el volumen al 50%
audioElement.volume = 0.5;


// -----------------------------------------------------//


// monstruos aleatorios
const monstruos = [
    './images/004 - Akaza card.gif',
    './images/005 - Kokushibo card.gif',
    './images/006 - Doma card.gif',
];

function mostrarMonstruoAleatorio() {
    const randomIndex = Math.floor(Math.random() * monstruos.length);
    const monstruoSeleccionado = monstruos[randomIndex];
    const imgMonstruo = document.querySelector('.personaje-monstruo img[alt="monstruo"]');
    imgMonstruo.src = monstruoSeleccionado;
}

document.addEventListener('DOMContentLoaded', mostrarMonstruoAleatorio);


// -----------------------------------------------------//


// Boton de iniciar
function startGame() {
    var actions = ['ataque', 'defensa'];
    var randomAction = actions[Math.floor(Math.random() * actions.length)];

    // Selección de ataque y defensa aleatorios
    if (randomAction === 'ataque') {
        document.querySelector('.button-ataque').style.display = 'block';
        document.querySelector('.button-defensa').style.display = 'none';
    } else {
        document.querySelector('.button-ataque').style.display = 'none';
        document.querySelector('.button-defensa').style.display = 'block';
    }

    document.getElementById('start-button-container').style.display = 'none';
    document.querySelector('.scenario1').style.display = 'block';
}


// -----------------------------------------------------//


// Nivel de vida y turno al azar //
let playerHealth = 100;
let playerMaxHealth = 100;
let opponentHealth = 100;
let isPlayerTurn = Math.random() < 0.5; // Iniciar aleatoriamente entre ataque y defensa
let selectedDefense = '';

// Actualizar la barra de vida en el progress bar //
function actualizarBarraDeVida() {
  const progressBarPlayer = document.getElementById('progressBarPlayer');
  const progressBarOpponent = document.getElementById('progressBarOpponent');

  progressBarPlayer.value = playerHealth;
  progressBarPlayer.max = playerMaxHealth;

  progressBarOpponent.value = opponentHealth;
}

// Mensajes de alerta personalizados //
function mostrarMensaje(mensaje) {
  return new Promise(resolve => {
    // Crear un elemento div para la alerta personalizada
    const alerta = document.createElement('div');
    alerta.className = 'alerta-personalizada';
    alerta.textContent = mensaje;

    // Establecer los estilos de la alerta
    alerta.style.position = 'fixed';
    alerta.style.top = '80%';
    alerta.style.left = '50%';
    alerta.style.transform = 'translate(-50%, -50%)';
    alerta.style.backgroundColor = '#ffffff';
    alerta.style.color = '#000082';
    alerta.style.padding = '20px';
    alerta.style.borderRadius = '10px';
    alerta.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    alerta.style.zIndex = '9999';
    alerta.style.fontSize = '2em';
    alerta.style.textAlign = 'center';
    alerta.style.border = '5px solid #000082';

    // Crear el botón de aceptar
    const botonAceptar = document.createElement('button');
    botonAceptar.textContent = 'Aceptar';
    botonAceptar.style.backgroundColor = '#000082';
    botonAceptar.style.color = '#ffffff';
    botonAceptar.style.border = 'none';
    botonAceptar.style.padding = '10px 20px';
    botonAceptar.style.marginTop = '10px';
    botonAceptar.style.borderRadius = '5px';
    botonAceptar.style.display = 'block';
    botonAceptar.style.margin = '0 auto'; 
    botonAceptar.style.marginTop = '20px';

    // Botón de aceptar a la alerta
    alerta.appendChild(botonAceptar);

    // Agregar la alerta al documento
    document.body.appendChild(alerta);

    // Agregar un evento al botón de aceptar para cerrar la alerta y resolver la promesa
    botonAceptar.addEventListener('click', function() {
      document.body.removeChild(alerta);
      resolve();
    });
  });
}



// Calcular el daño según el ataque y la defensa //
function calcularDanio(ataque, defensa) {
  const reglasDanio = {
    "agua-agua": -10,
    "agua-fuego": -20,
    "agua-rayo": 0,
    "fuego-fuego": -10,
    "fuego-agua": 0,
    "fuego-rayo": -20,
    "rayo-rayo": -10,
    "rayo-fuego": -10,
    "rayo-agua": -20
  };

  const key = `${ataque}-${defensa}`;

  return reglasDanio[key] || 0;
}

// Ataque aleatorio del oponente //
function getRandomAttack() {
  const attacks = ["agua", "fuego", "rayo"];
  const randomIndex = Math.floor(Math.random() * attacks.length);
  return attacks[randomIndex];
}

// Defensa aleatoria del oponente //
function getRandomDefense() {
  const defenses = ["agua", "fuego", "rayo"];
  const randomIndex = Math.floor(Math.random() * defenses.length);
  return defenses[randomIndex];
}


// Ataque del jugador //
async function atacar(attackType) {
  if (!isPlayerTurn) {
    return;
  }

  const defenseType = getRandomDefense();

  const danio = calcularDanio(attackType, defenseType);

  await mostrarMensaje(`Has atacado con ${attackType} y el oponente se ha defendido con ${defenseType}.\nLe has hecho ${-danio} puntos de daño al oponente.`);

  opponentHealth -= -danio;

  actualizarBarraDeVida();

  if (opponentHealth <= 0) {
    await mostrarMensaje('¡Has ganado el juego!');
    window.location.href = 'personajes.html'; // Redirigir a la página "personajes"
    return;
  }

  isPlayerTurn = false;
  document.getElementById('ataque').style.display = 'none';
  document.getElementById('defensa').style.display = 'block';

  await mostrarMensaje('Selecciona tu defensa.');
}

// Defensa del jugador //
async function defender(defensa) {
  if (!isPlayerTurn) {
    selectedDefense = defensa;

    const attackType = getRandomAttack();
    const danio = calcularDanio(attackType, selectedDefense);

    await mostrarMensaje(`El oponente ha atacado con ${attackType} y te has defendido con ${selectedDefense}.\nEl oponente te ha hecho ${-danio} puntos de daño.`);

    playerHealth -= -danio;

    actualizarBarraDeVida();

    if (playerHealth <= 0) {
      await mostrarMensaje('¡Has perdido el juego!');
      window.location.href = 'personajes.html'; // Redirigir a la página "personajes"
      return;
    }

    isPlayerTurn = true;
    document.getElementById('ataque').style.display = 'block';
    document.getElementById('defensa').style.display = 'none';

    await mostrarMensaje('Selecciona tu ataque.');
  }
}

// Turno de ataque del oponente
async function oponenteAtaca() {
  if (isPlayerTurn) {
    return;
  }

  const attackType = getRandomAttack();
  const defenseType = getRandomDefense();

  const danio = calcularDanio(attackType, defenseType);

  await mostrarMensaje(`El oponente ha atacado con ${attackType} y te has defendido con ${defenseType}.\nEl oponente te ha quitado ${-danio} puntos de vida y has recibido ${danio} puntos de daño.`);

  playerHealth -= -danio;

  actualizarBarraDeVida();

  if (playerHealth <= 0) {
    await mostrarMensaje('¡Has perdido el juego!');
    window.location.href = 'personajes.html'; // Redirigir a la página "personajes"
    return;
  }

  isPlayerTurn = true;
  document.getElementById('ataque').style.display = 'block';
  document.getElementById('defensa').style.display = 'none';

  await mostrarMensaje('Ahora es tu turno.');
}

// Actualizar la barra de vida
actualizarBarraDeVida();