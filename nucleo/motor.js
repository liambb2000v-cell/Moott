// ============================================================
// NÚCLEO DEL MOTOR
// ============================================================
//
// Este archivo NO sabe qué es "tierra" ni "pasto". Solo sabe:
//  - cómo dibujar un mundo hecho de bloques (usando lo que
//    haya en el registro de Bloques),
//  - cómo correr el loop del juego (actualizar todo muchas
//    veces por segundo),
//  - cómo adaptarse al contenedor donde se lo embeba.
//
// Todo lo específico del juego (qué bloques existen, cómo se
// ve el mundo) se define AFUERA, en un archivo de configuración.

const MiMotor = {};

MiMotor.TAMANO_TILE = 32; // tamaño en pixeles de cada bloque (pixel art)

// -----------------------------------------------------------
// iniciar(elementoContenedor, opciones)
// -----------------------------------------------------------
// Arranca el motor dentro del elemento HTML que se le pase.
// opciones.mundo: matriz de filas x columnas con ids de bloques
//   (por ejemplo: [['aire','aire'], ['tierra','tierra']])
MiMotor.iniciar = function (elementoContenedor, opciones) {
  opciones = opciones || {};
  const mundo = opciones.mundo || [[]];

  const app = new PIXI.Application({
    resizeTo: elementoContenedor, // clave para que sea embebible: se ajusta al contenedor, no a toda la pantalla
    backgroundColor: opciones.colorDeFondo || 0x1a1a2e,
    antialias: false, // sin suavizado, para que el pixel art se vea nítido
  });

  elementoContenedor.appendChild(app.view);

  const capaMundo = new PIXI.Container();
  app.stage.addChild(capaMundo);

  // Guardamos referencia a los sprites dibujados por posición,
  // para poder modificarlos o quitarlos después (por ejemplo, al
  // romper un bloque) sin tener que redibujar todo el mundo.
  const spritesPorPosicion = {};

  function dibujarMundoCompleto() {
    capaMundo.removeChildren();

    for (let fila = 0; fila < mundo.length; fila++) {
      for (let columna = 0; columna < mundo[fila].length; columna++) {
        dibujarBloque(fila, columna);
      }
    }
  }

  function dibujarBloque(fila, columna) {
    const idBloque = mundo[fila][columna];
    const bloque = Bloques.obtener(idBloque);

    if (!bloque || !bloque.visible) return; // no se dibuja (ej: aire)

    let grafico;

    if (bloque.matrizTextura) {
      // La textura define la forma real del bloque (minibloques)
      grafico = MiniBloques.generarDesdeMatriz(bloque.matrizTextura);
    } else if (bloque.textura) {
      // Si el bloque tiene una imagen asignada, la usamos
      grafico = PIXI.Sprite.from(bloque.textura);
      grafico.width = MiMotor.TAMANO_TILE;
      grafico.height = MiMotor.TAMANO_TILE;
    } else {
      // Si todavía no tiene textura, dibujamos un color plano de prueba
      grafico = new PIXI.Graphics();
      grafico.beginFill(bloque.colorProvisional || 0xff00ff); // rosa fuerte = "falta textura"
      grafico.drawRect(0, 0, MiMotor.TAMANO_TILE, MiMotor.TAMANO_TILE);
      grafico.endFill();
    }

    grafico.x = columna * MiMotor.TAMANO_TILE;
    grafico.y = fila * MiMotor.TAMANO_TILE;

    capaMundo.addChild(grafico);
    spritesPorPosicion[`${fila}_${columna}`] = grafico;

    if (typeof bloque.alColocarse === 'function') {
      bloque.alColocarse({ fila, columna });
    }
  }

  // -----------------------------------------------------------
  // romperBloque(fila, columna)
  // -----------------------------------------------------------
  // Reemplaza el bloque en esa posición por "aire" y ejecuta
  // su función alRomperse, si tiene una definida.
  function romperBloque(fila, columna) {
    const idBloque = mundo[fila][columna];
    const bloque = Bloques.obtener(idBloque);

    if (bloque && typeof bloque.alRomperse === 'function') {
      bloque.alRomperse({ fila, columna });
    }

    mundo[fila][columna] = 'aire';

    const clave = `${fila}_${columna}`;
    if (spritesPorPosicion[clave]) {
      capaMundo.removeChild(spritesPorPosicion[clave]);
      delete spritesPorPosicion[clave];
    }
  }

  // -----------------------------------------------------------
  // LOOP DEL JUEGO
  // -----------------------------------------------------------
  // app.ticker.add ejecuta esta función muchas veces por segundo
  // (normalmente 60 veces). Acá es donde, más adelante, se van a
  // actualizar animaciones, física, e invocar cadaTick de los bloques.
  app.ticker.add((delta) => {
    for (let fila = 0; fila < mundo.length; fila++) {
      for (let columna = 0; columna < mundo[fila].length; columna++) {
        const idBloque = mundo[fila][columna];
        const bloque = Bloques.obtener(idBloque);
        if (bloque && typeof bloque.cadaTick === 'function') {
          bloque.cadaTick({ fila, columna, delta });
        }
      }
    }
  });

  dibujarMundoCompleto();

  // Devolvemos una "API pública" para poder controlar el motor
  // desde afuera (por ejemplo, desde el editor que armemos después)
  return {
    app,
    capaMundo,
    mundo,
    romperBloque,
    dibujarMundoCompleto,
  };
};
