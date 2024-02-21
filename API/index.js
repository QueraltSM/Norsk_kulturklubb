const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/data', (req, res) => {
  //res.json({ message: 'Datos de ejemplo desde la API' });
  res.send('Hola');
});

app.listen(PORT, () => {
  console.log('Server listening port ${PORT}');
});
