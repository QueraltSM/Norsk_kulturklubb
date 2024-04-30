const express = require('express');
const app = express();

app.get('/Culture/:encodedTitle', (req, res) => {
  const encodedTitle = req.params.encodedTitle;
  const decodedTitle = decodeURIComponent(encodedTitle.replace(/-/g, ' '));
  console.log('Título:', decodedTitle);
  const contenidoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${decodedTitle}</title>
    </head>
    <body>
      <h1>${decodedTitle}</h1>
      <p>Bienvenido a nuestra página sobre ${decodedTitle}!</p>
    </body>
    </html>
  `;
  res.send(contenidoHTML);
});
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
