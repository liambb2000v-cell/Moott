// ============================================================
// CONFIGURACIÓN DE EJEMPLO
// ============================================================
// Este archivo es un EJEMPLO de cómo alguien usaría el motor.
// No es parte del núcleo: podrías borrar este archivo entero
// y reemplazarlo por otro completamente distinto, con otros
// bloques y otro mundo, sin tocar nada de /nucleo.

// --- Registramos bloques a partir del empty block ---

Bloques.registrar('tierra', {
  colorProvisional: 0x8b5a2b, // marrón (hasta que le carguemos una textura real)
  visible: true,
  solido: true,
  alRomperse: (info) => {
    console.log(`Se rompió un bloque de tierra en fila ${info.fila}, columna ${info.columna}`);
  },
});

Bloques.registrar('pasto', {
  colorProvisional: 0x4caf50, // verde
  visible: true,
  solido: true,
});

// Ejemplo de bloque con comportamiento especial, para mostrar
// que el "empty block" se puede convertir en lo que sea:
// un bloque que se rompe solo con tocarlo.
Bloques.registrar('cristal_fragil', {
  colorProvisional: 0x9be7ff, // celeste
  visible: true,
  solido: true,
  romperAlTocar: true,
  alTocar: (info) => {
    console.log(`El cristal frágil en fila ${info.fila}, columna ${info.columna} se rompió al ser tocado.`);
  },
});

// Ejemplo de bloque con TEXTURA POR MATRIZ: en vez de un color plano,
// esta imagen (armada a mano acá, hasta que tengamos el editor con
// carga de archivos) define la forma real del bloque: un arbolito.
// v = verde (copa), m = marrón (tronco), n = transparente (no dibuja nada)
const v = 0x4caf50;
const m = 0x795548;
const n = null;

Bloques.registrar('arbol', {
  visible: true,
  solido: true, // por ahora, colisiona como un rectángulo simple (la hitbox)
  matrizTextura: [
    [n, n, v, v, v, v, n, n],
    [n, v, v, v, v, v, v, n],
    [v, v, v, v, v, v, v, v],
    [v, v, v, v, v, v, v, v],
    [n, v, v, v, v, v, v, n],
    [n, n, n, m, m, n, n, n],
    [n, n, n, m, m, n, n, n],
    [n, n, n, m, m, n, n, n],
    [n, n, n, m, m, n, n, n],
    [n, n, n, m, m, n, n, n],
  ],
});

// --- Definimos el mundo de prueba usando los ids registrados ---

const mundoDePrueba = [
  ['aire','aire','aire','aire','aire','aire','aire','aire','aire','aire'],
  ['aire','aire','aire','aire','aire','aire','aire','aire','aire','aire'],
  ['aire','aire','aire','cristal_fragil','aire','aire','aire','aire','aire','aire'],
  ['aire','arbol','aire','aire','aire','aire','aire','aire','aire','aire'],
  ['pasto','pasto','pasto','pasto','pasto','pasto','pasto','pasto','pasto','pasto'],
  ['tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra'],
  ['tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra'],
  ['tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra'],
];

// --- Antes de arrancar, preguntamos PC o Mobile ---
// Esto activa el esquema de controles correspondiente (nucleo/input.js)
// y recién después arranca el motor con el mundo de prueba.

const contenedor = document.getElementById('motor-contenedor');

PantallaSeleccion.mostrar(contenedor, function (esquemaElegido) {
  Input.iniciar(esquemaElegido, contenedor);
  MiMotor.iniciar(contenedor, { mundo: mundoDePrueba });
  mostrarHudDeDepuracion(contenedor, esquemaElegido);
});

// --- HUD de depuración temporal ---
// Solo para confirmar visualmente que el esquema elegido funciona:
// muestra en texto qué señales de Input están activas ahora mismo.
function mostrarHudDeDepuracion(contenedor, esquema) {
  const hud = document.createElement('div');
  hud.style.position = 'absolute';
  hud.style.top = '8px';
  hud.style.left = '8px';
  hud.style.color = '#fff';
  hud.style.fontFamily = 'monospace';
  hud.style.fontSize = '12px';
  hud.style.background = 'rgba(0,0,0,0.5)';
  hud.style.padding = '6px';
  hud.style.zIndex = '150';
  contenedor.appendChild(hud);

  setInterval(() => {
    const s = Input.estado;
    hud.textContent =
      `Esquema: ${esquema}\n` +
      `izquierda: ${s.izquierda}  derecha: ${s.derecha}\n` +
      `arriba: ${s.arriba}  abajo: ${s.abajo}\n` +
      `accion: ${s.accion}`;
  }, 100);
}
