// ============================================================
// EDITOR
// ============================================================
// Arma el panel lateral con los 5 bloques (BLOQUES_DEL_PANEL,
// definidos en bloques-base.js) y conecta la interacción:
// tocás un bloque del panel para seleccionarlo, después tocás
// una celda del mundo para colocarlo ahí.

const Editor = {};

Editor.bloqueSeleccionado = 'tierra'; // arranca con tierra seleccionada por defecto

// -----------------------------------------------------------
// Mundo vacío inicial: todo "aire", para que el usuario empiece
// a construir desde cero. 20 columnas x 15 filas, alcanza para
// probar cómodamente en pantalla.
// -----------------------------------------------------------
const ANCHO_MUNDO = 20;
const ALTO_MUNDO = 15;

const mundoDelEditor = [];
for (let fila = 0; fila < ALTO_MUNDO; fila++) {
  const filaVacia = [];
  for (let columna = 0; columna < ANCHO_MUNDO; columna++) {
    filaVacia.push('aire');
  }
  mundoDelEditor.push(filaVacia);
}

// -----------------------------------------------------------
// Armamos el panel lateral con un botón por cada bloque
// -----------------------------------------------------------
function armarPanelLateral() {
  const panel = document.getElementById('panel-lateral');

  BLOQUES_DEL_PANEL.forEach((info) => {
    const boton = document.createElement('div');
    boton.className = 'boton-bloque';
    boton.textContent = info.etiqueta;

    const bloque = Bloques.obtener(info.id);
    boton.style.background = '#' + (bloque.colorProvisional || 0).toString(16).padStart(6, '0');

    // El multifuncional (negro) necesita texto blanco para leerse;
    // el resto usa texto oscuro, ya que sus colores son claros.
    boton.style.color = info.id === 'multifuncional' ? '#fff' : '#000';

    if (info.id === Editor.bloqueSeleccionado) {
      boton.classList.add('seleccionado');
    }

    boton.addEventListener('click', () => seleccionarBloque(info.id, boton));

    panel.appendChild(boton);
  });
}

function seleccionarBloque(idBloque, botonElegido) {
  Editor.bloqueSeleccionado = idBloque;

  // Quitamos el resaltado del botón anterior y lo ponemos en el nuevo
  document.querySelectorAll('.boton-bloque').forEach((b) => b.classList.remove('seleccionado'));
  botonElegido.classList.add('seleccionado');
}

// -----------------------------------------------------------
// Arrancamos el motor con el mundo vacío, y conectamos los
// toques del viewport a "colocar el bloque seleccionado"
// -----------------------------------------------------------
function iniciarEditor() {
  armarPanelLateral();

  const contenedor = document.getElementById('motor-contenedor');
  const instanciaMotor = MiMotor.iniciar(contenedor, { mundo: mundoDelEditor });

  // Escuchamos toques sobre el canvas del motor para saber en qué
  // celda de la grilla tocó el usuario, y ahí colocamos el bloque.
  instanciaMotor.app.view.addEventListener('pointerdown', (evento) => {
    const rect = instanciaMotor.app.view.getBoundingClientRect();
    const xEnCanvas = evento.clientX - rect.left;
    const yEnCanvas = evento.clientY - rect.top;

    const columna = Math.floor(xEnCanvas / MiMotor.TAMANO_TILE);
    const fila = Math.floor(yEnCanvas / MiMotor.TAMANO_TILE);

    // Verificamos que la celda tocada esté dentro del mundo
    if (fila < 0 || fila >= mundoDelEditor.length) return;
    if (columna < 0 || columna >= mundoDelEditor[0].length) return;

    mundoDelEditor[fila][columna] = Editor.bloqueSeleccionado;
    instanciaMotor.dibujarMundoCompleto();
  });
}

iniciarEditor();
