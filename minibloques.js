// ============================================================
// SISTEMA DE MINIBLOQUES
// ============================================================
//
// Esto resuelve el pedido de que una textura no sea "una imagen
// pegada", sino que cambie la FORMA real del bloque.
//
// La idea: en vez de dibujar un cuadrado grande con la imagen
// estirada adentro, tomamos la imagen píxel por píxel, y por
// cada píxel que NO es transparente, dibujamos un cuadradito
// (un "minibloque") de ese mismo color. Los píxeles transparentes
// simplemente no generan nada ahí. El resultado: un bloque que
// tiene la silueta real de la imagen (por ejemplo, un árbol con
// tronco angosto y copa ancha, no un cuadrado).

const MiniBloques = {};

// Tamaño en pantalla (pixeles reales) de cada minibloque.
// Con esto controlamos qué tan "grande" se ve el pixel art.
MiniBloques.TAMANO_MINIBLOQUE = 4;

// -----------------------------------------------------------
// generarDesdeMatriz(matriz)
// -----------------------------------------------------------
// matriz: array de filas, cada celda es un color (número hex,
// como 0x4caf50) o null si ese "píxel" es transparente.
// Devuelve un PIXI.Container con todos los minibloques ya armados.
MiniBloques.generarDesdeMatriz = function (matriz) {
  const contenedor = new PIXI.Container();
  const tamano = MiniBloques.TAMANO_MINIBLOQUE;

  for (let fila = 0; fila < matriz.length; fila++) {
    for (let columna = 0; columna < matriz[fila].length; columna++) {
      const color = matriz[fila][columna];
      if (color === null || color === undefined) continue; // transparente: no dibuja nada

      const mini = new PIXI.Graphics();
      mini.beginFill(color);
      mini.drawRect(0, 0, tamano, tamano);
      mini.endFill();

      mini.x = columna * tamano;
      mini.y = fila * tamano;

      contenedor.addChild(mini);
    }
  }

  return contenedor;
};

// -----------------------------------------------------------
// generarDesdeImagen(rutaImagen)
// -----------------------------------------------------------
// Para cuando el usuario suba una imagen real (pixel art, hasta
// 64x64) desde el editor. Lee la imagen con un canvas invisible,
// saca el color de cada píxel, y arma la matriz automáticamente
// para pasársela a generarDesdeMatriz.
//
// Devuelve una Promise porque cargar una imagen es asíncrono.
MiniBloques.generarDesdeImagen = function (rutaImagen) {
  return new Promise((resolver, rechazar) => {
    const imagen = new Image();
    imagen.crossOrigin = 'anonymous';

    imagen.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = imagen.width;
      canvas.height = imagen.height;

      const contexto = canvas.getContext('2d');
      contexto.drawImage(imagen, 0, 0);

      const datos = contexto.getImageData(0, 0, imagen.width, imagen.height).data;

      const matriz = [];
      for (let y = 0; y < imagen.height; y++) {
        const fila = [];
        for (let x = 0; x < imagen.width; x++) {
          const indice = (y * imagen.width + x) * 4;
          const r = datos[indice];
          const g = datos[indice + 1];
          const b = datos[indice + 2];
          const alfa = datos[indice + 3];

          if (alfa < 10) {
            fila.push(null); // píxel transparente
          } else {
            const colorHex = (r << 16) + (g << 8) + b;
            fila.push(colorHex);
          }
        }
        matriz.push(fila);
      }

      resolver(MiniBloques.generarDesdeMatriz(matriz));
    };

    imagen.onerror = () => rechazar(new Error(`No se pudo cargar la imagen: ${rutaImagen}`));
    imagen.src = rutaImagen;
  });
};
