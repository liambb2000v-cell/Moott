// ============================================================
// SERVIDOR
// ============================================================
// Por ahora este servidor solo entrega los archivos del motor
// (index.html, nucleo/, config-ejemplo.js) al navegador, igual
// que haría un sitio estático.
//
// La diferencia con un "Static Site" es que este es un servidor
// de verdad: más adelante acá vamos a poder agregar rutas como
// /api/generar-textura o /api/asistente-codigo, que llamen a
// Hugging Face o a un asistente de IA desde el servidor (cosa
// que un sitio estático no puede hacer).

const express = require('express');
const path = require('path');

const app = express();
const PUERTO = process.env.PORT || 3000; // Render asigna el puerto por variable de entorno

// Sirve todos los archivos de esta carpeta (index.html, nucleo/, etc.)
// tal cual están, sin necesidad de nada más.
//
// setHeaders desactiva el cacheo del navegador: mientras estamos
// desarrollando el motor, los archivos cambian todo el tiempo, y no
// queremos que el navegador se quede mostrando una versión vieja.
app.use(express.static(path.join(__dirname), {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  },
}));

// --------------------------------------------------------
// Acá abajo, más adelante, van a ir las rutas de API. Por ejemplo:
//
// app.post('/api/generar-textura', async (req, res) => {
//   // llamar a un modelo de Hugging Face y devolver la imagen generada
// });
//
// app.post('/api/asistente-codigo', async (req, res) => {
//   // llamar a un asistente de IA y devolver sugerencias de código
// });
// --------------------------------------------------------

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});
