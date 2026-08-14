// ============================================================
// BLOQUES BASE DEL EDITOR
// ============================================================
// Estos son los 5 bloques que siempre están disponibles en el
// panel lateral del editor. Los 4 primeros vienen con su
// apariencia y comportamiento ya definidos. El quinto (multifuncional)
// arranca completamente vacío (negro), para que el usuario lo
// programe a su gusto desde el editor.

Bloques.registrar('tierra', {
  colorProvisional: 0x8b5a2b, // marrón, hasta tener una textura real
  visible: true,
  solido: true,
});

Bloques.registrar('agua', {
  colorProvisional: 0x2196f3, // azul
  visible: true,
  solido: false, // por ahora no bloquea el paso (después: física de líquido)
});

Bloques.registrar('jugador', {
  colorProvisional: 0xffeb3b, // amarillo, para distinguirlo fácil en el editor
  visible: true,
  solido: false, // el jugador no colisiona consigo mismo
});

Bloques.registrar('enemigo', {
  colorProvisional: 0xf44336, // rojo
  visible: true,
  solido: true,
});

// El multifuncional arranca en negro puro y sin ningún comportamiento.
// El usuario lo personaliza por completo desde el editor (textura,
// color, o código JS) — ver nucleo/editor.js.
Bloques.registrar('multifuncional', {
  colorProvisional: 0x000000, // negro: "lienzo en blanco"
  visible: true,
  solido: false,
});

// Lista de los 5 bloques que van al panel lateral, en orden,
// con una etiqueta corta para mostrar en el botón.
const BLOQUES_DEL_PANEL = [
  { id: 'tierra', etiqueta: 'Tierra' },
  { id: 'agua', etiqueta: 'Agua' },
  { id: 'jugador', etiqueta: 'Jugador' },
  { id: 'enemigo', etiqueta: 'Enemigo' },
  { id: 'multifuncional', etiqueta: '?' },
];
