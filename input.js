// ============================================================
// SISTEMA DE INPUT
// ============================================================
//
// Este archivo tampoco sabe nada del juego en sí. Su trabajo es:
//  - Recibir teclado (PC) o toques (Mobile), según lo que se elija.
//  - Traducir eso a un mismo conjunto de "señales" (Input.estado),
//    para que el resto del motor no necesite saber qué esquema
//    de controles está activo.
//
// Ejemplo de uso desde afuera del motor:
//   if (Input.estado.derecha) { personaje.x += velocidad; }

const Input = {};

// Estado actual de las señales. El resto del motor solo lee esto.
Input.estado = {
  izquierda: false,
  derecha: false,
  arriba: false,
  abajo: false,
  accion: false, // botón de acción genérico (atacar, interactuar, etc.)
};

Input.esquemaActivo = null; // 'pc' o 'mobile'

// -----------------------------------------------------------
// iniciar(esquema, elementoContenedor)
// -----------------------------------------------------------
Input.iniciar = function (esquema, elementoContenedor) {
  Input.esquemaActivo = esquema;

  if (esquema === 'pc') {
    Input._iniciarControlesPC();
  } else if (esquema === 'mobile') {
    Input._iniciarControlesMobile(elementoContenedor);
  } else {
    console.warn(`Esquema de controles desconocido: "${esquema}"`);
  }
};

// -----------------------------------------------------------
// Controles de PC: teclado (flechas o WASD)
// -----------------------------------------------------------
Input._iniciarControlesPC = function () {
  const TECLA_A_SEÑAL = {
    ArrowLeft: 'izquierda', KeyA: 'izquierda',
    ArrowRight: 'derecha', KeyD: 'derecha',
    ArrowUp: 'arriba', KeyW: 'arriba',
    ArrowDown: 'abajo', KeyS: 'abajo',
    Space: 'accion',
  };

  window.addEventListener('keydown', (evento) => {
    const señal = TECLA_A_SEÑAL[evento.code];
    if (señal) Input.estado[señal] = true;
  });

  window.addEventListener('keyup', (evento) => {
    const señal = TECLA_A_SEÑAL[evento.code];
    if (señal) Input.estado[señal] = false;
  });
};

// -----------------------------------------------------------
// Controles de Mobile: joystick virtual táctil (versión simple)
// -----------------------------------------------------------
Input._iniciarControlesMobile = function (elementoContenedor) {
  // Creamos un joystick básico: un círculo fijo abajo a la izquierda.
  // Detectamos en qué dirección se arrastra el dedo desde el centro
  // del joystick, y activamos las señales según esa dirección.

  const joystickBase = document.createElement('div');
  joystickBase.style.position = 'absolute';
  joystickBase.style.left = '30px';
  joystickBase.style.bottom = '30px';
  joystickBase.style.width = '100px';
  joystickBase.style.height = '100px';
  joystickBase.style.borderRadius = '50%';
  joystickBase.style.background = 'rgba(255,255,255,0.15)';
  joystickBase.style.touchAction = 'none';
  joystickBase.style.zIndex = '100';

  const joystickPerilla = document.createElement('div');
  joystickPerilla.style.position = 'absolute';
  joystickPerilla.style.left = '30px';
  joystickPerilla.style.top = '30px';
  joystickPerilla.style.width = '40px';
  joystickPerilla.style.height = '40px';
  joystickPerilla.style.borderRadius = '50%';
  joystickPerilla.style.background = 'rgba(255,255,255,0.4)';
  joystickBase.appendChild(joystickPerilla);

  elementoContenedor.style.position = 'relative';
  elementoContenedor.appendChild(joystickBase);

  let activo = false;
  const centro = { x: 50, y: 50 }; // centro del joystick, relativo a joystickBase
  const radioMaximo = 40;

  function actualizarSeñales(dx, dy) {
    const umbral = 15; // qué tan lejos hay que mover el dedo para activar una dirección
    Input.estado.izquierda = dx < -umbral;
    Input.estado.derecha = dx > umbral;
    Input.estado.arriba = dy < -umbral;
    Input.estado.abajo = dy > umbral;
  }

  function manejarMovimiento(clienteX, clienteY) {
    const rect = joystickBase.getBoundingClientRect();
    let dx = clienteX - (rect.left + rect.width / 2);
    let dy = clienteY - (rect.top + rect.height / 2);

    const distancia = Math.sqrt(dx * dx + dy * dy);
    if (distancia > radioMaximo) {
      dx = (dx / distancia) * radioMaximo;
      dy = (dy / distancia) * radioMaximo;
    }

    joystickPerilla.style.left = (30 + dx) + 'px';
    joystickPerilla.style.top = (30 + dy) + 'px';

    actualizarSeñales(dx, dy);
  }

  function resetear() {
    joystickPerilla.style.left = '30px';
    joystickPerilla.style.top = '30px';
    Input.estado.izquierda = false;
    Input.estado.derecha = false;
    Input.estado.arriba = false;
    Input.estado.abajo = false;
  }

  joystickBase.addEventListener('touchstart', (evento) => {
    activo = true;
    const toque = evento.touches[0];
    manejarMovimiento(toque.clientX, toque.clientY);
  });

  joystickBase.addEventListener('touchmove', (evento) => {
    if (!activo) return;
    const toque = evento.touches[0];
    manejarMovimiento(toque.clientX, toque.clientY);
    evento.preventDefault();
  }, { passive: false });

  joystickBase.addEventListener('touchend', () => {
    activo = false;
    resetear();
  });

  // Botón de acción simple, abajo a la derecha
  const botonAccion = document.createElement('div');
  botonAccion.textContent = 'A';
  botonAccion.style.position = 'absolute';
  botonAccion.style.right = '30px';
  botonAccion.style.bottom = '30px';
  botonAccion.style.width = '60px';
  botonAccion.style.height = '60px';
  botonAccion.style.borderRadius = '50%';
  botonAccion.style.background = 'rgba(255,255,255,0.25)';
  botonAccion.style.color = '#fff';
  botonAccion.style.display = 'flex';
  botonAccion.style.alignItems = 'center';
  botonAccion.style.justifyContent = 'center';
  botonAccion.style.fontFamily = 'sans-serif';
  botonAccion.style.zIndex = '100';
  botonAccion.style.touchAction = 'none';

  botonAccion.addEventListener('touchstart', () => { Input.estado.accion = true; });
  botonAccion.addEventListener('touchend', () => { Input.estado.accion = false; });

  elementoContenedor.appendChild(botonAccion);
};
