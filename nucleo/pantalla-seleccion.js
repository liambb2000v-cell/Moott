// ============================================================
// PANTALLA DE SELECCIÓN: PC o Mobile
// ============================================================
//
// Es la "puerta de entrada" del motor: antes de arrancar el juego,
// le preguntamos al usuario en qué está jugando, para activar el
// esquema de controles correcto (ver nucleo/input.js).
//
// Esta pantalla es deliberadamente simple (dos botones), porque
// todavía no es el editor visual del motor, solo lo mínimo para
// poder probar la separación de controles PC/Mobile.

const PantallaSeleccion = {};

// -----------------------------------------------------------
// mostrar(elementoContenedor, alElegir)
// -----------------------------------------------------------
// alElegir es una función que se llama con 'pc' o 'mobile'
// una vez que el usuario toca un botón.
PantallaSeleccion.mostrar = function (elementoContenedor, alElegir) {
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0,0,0,0.85)';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '200';
  overlay.style.fontFamily = 'sans-serif';
  overlay.style.color = '#fff';

  const titulo = document.createElement('div');
  titulo.textContent = '¿Cómo estás jugando?';
  titulo.style.fontSize = '20px';
  titulo.style.marginBottom = '24px';
  overlay.appendChild(titulo);

  const contenedorBotones = document.createElement('div');
  contenedorBotones.style.display = 'flex';
  contenedorBotones.style.gap = '16px';
  overlay.appendChild(contenedorBotones);

  function crearBoton(texto, valor) {
    const boton = document.createElement('button');
    boton.textContent = texto;
    boton.style.padding = '16px 24px';
    boton.style.fontSize = '16px';
    boton.style.borderRadius = '8px';
    boton.style.border = 'none';
    boton.style.background = '#4caf50';
    boton.style.color = '#fff';
    boton.style.cursor = 'pointer';

    boton.addEventListener('click', () => {
      elementoContenedor.removeChild(overlay);
      alElegir(valor);
    });

    return boton;
  }

  contenedorBotones.appendChild(crearBoton('PC', 'pc'));
  contenedorBotones.appendChild(crearBoton('Mobile', 'mobile'));

  elementoContenedor.style.position = 'relative';
  elementoContenedor.appendChild(overlay);
};
