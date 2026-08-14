// ============================================================
// SISTEMA DE BLOQUES
// ============================================================
//
// Idea central: el motor NO sabe qué es "tierra" o "pasto".
// Solo conoce un molde base llamado "empty block", y todo bloque
// nuevo se crea copiando ese molde y cambiando lo que haga falta.
//
// Esto es lo que en programación se llama un "registro" (registry):
// una lista donde guardamos, con un nombre (id), la definición de
// cada bloque que existe en el juego.

const Bloques = {};

// Acá se van a guardar todos los bloques ya registrados.
// Ejemplo de cómo queda después de registrar "tierra":
// { "tierra": { textura: ..., solido: true, ... } }
Bloques._registro = {};

// -----------------------------------------------------------
// EMPTY BLOCK: la plantilla base de la que parte TODO bloque.
// Representa "nada" (aire) por defecto: invisible, no sólido,
// sin comportamientos. Cambiando estas propiedades se puede
// convertir en cualquier cosa (tierra, lava, un bloque que
// se rompe al tocarlo, etc.)
// -----------------------------------------------------------
Bloques.EMPTY_BLOCK = {
  // --- Apariencia ---
  textura: null,      // ruta a la imagen del bloque, o null si no se dibuja
  colorProvisional: null, // color plano de prueba, por si aún no hay textura

  // --- Física / comportamiento base ---
  visible: false,      // ¿se dibuja en pantalla?
  solido: false,        // ¿bloquea el paso de entidades (jugador, etc.)?
  romperAlTocar: false, // ¿desaparece apenas algo lo toca?

  // --- Eventos: funciones opcionales que el usuario puede definir ---
  // Cada una recibe información sobre lo que pasó (mundo, posición, entidad)
  alColocarse: null,   // cuando el bloque aparece en el mundo
  alRomperse: null,    // cuando el bloque es destruido
  alTocar: null,       // cuando una entidad lo toca
  cadaTick: null,       // se ejecuta en cada "paso" del juego (para animaciones, etc.)
};

// -----------------------------------------------------------
// registrar(id, propiedades)
// -----------------------------------------------------------
// Crea un bloque nuevo a partir del EMPTY_BLOCK, sobreescribiendo
// solo las propiedades que se le pasen. Así nunca hace falta
// definir un bloque completo desde cero.
//
// Ejemplo de uso (esto NO va en este archivo, va en la configuración
// de quien usa el motor):
//
//   Bloques.registrar('tierra', {
//     colorProvisional: 0x8b5a2b,
//     visible: true,
//     solido: true,
//   });
//
Bloques.registrar = function (id, propiedades) {
  if (Bloques._registro[id]) {
    console.warn(`El bloque "${id}" ya estaba registrado. Se va a reemplazar.`);
  }

  // Object.assign copia las propiedades del molde base y luego
  // le encima (sobreescribe) las que el usuario haya definido.
  const bloqueNuevo = Object.assign({}, Bloques.EMPTY_BLOCK, propiedades);
  bloqueNuevo.id = id;

  Bloques._registro[id] = bloqueNuevo;
  return bloqueNuevo;
};

// -----------------------------------------------------------
// obtener(id)
// -----------------------------------------------------------
// Devuelve la definición de un bloque ya registrado.
Bloques.obtener = function (id) {
  const bloque = Bloques._registro[id];
  if (!bloque) {
    console.warn(`No existe ningún bloque registrado con id "${id}".`);
    return null;
  }
  return bloque;
};

// Registramos el bloque "aire" por defecto usando el propio molde vacío,
// así siempre existe un bloque de id "aire" para representar espacio vacío.
Bloques.registrar('aire', {});
