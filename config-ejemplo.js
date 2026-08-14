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

// --- Definimos el mundo de prueba usando los ids registrados ---

const mundoDePrueba = [
  ['aire','aire','aire','aire','aire','aire','aire','aire','aire','aire'],
  ['aire','aire','aire','aire','aire','aire','aire','aire','aire','aire'],
  ['aire','aire','aire','cristal_fragil','aire','aire','aire','aire','aire','aire'],
  ['aire','aire','aire','aire','aire','aire','aire','aire','aire','aire'],
  ['pasto','pasto','pasto','pasto','pasto','pasto','pasto','pasto','pasto','pasto'],
  ['tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra'],
  ['tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra'],
  ['tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra','tierra'],
];

// --- Arrancamos el motor con este mundo ---
// (si esta página se embebe en otro sitio, quien la embeba podría
// llamar a MiMotor.iniciar con OTRO mundo y otros bloques distintos)

const contenedor = document.getElementById('motor-contenedor');
MiMotor.iniciar(contenedor, { mundo: mundoDePrueba });
