const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());

const credentialsFilePath = 'C:/UNED/TFM/Norsk kulturklubb/AWS/credentials';
const credentials = fs.readFileSync(credentialsFilePath, 'utf8').split('\n')
  .reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});

AWS.config.update({
  region: credentials.region,
  accessKeyId: credentials.aws_access_key_id,
  secretAccessKey: credentials.aws_secret_access_key
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.get('/api/getWordOfTheDay', (req, res) => {
  const params = {
    TableName: 'Words',
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error('Error al escanear la tabla:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.json(data);
    }
  });
});

app.get('/api/getTeachers', (req, res) => {
  const params = {
    TableName: 'Teachers',
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error('Error al escanear la tabla:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.json(data);
    }
  });
});

app.get('/api/getTeacher', (req, res) => {
  const teacherId = req.query.id;

  if (!teacherId) {
    res.status(400).send('Se requiere el parámetro "id" para obtener un profesor específico');
    return;
  }

  const params = {
    TableName: 'Teachers',
    Key: {
      "ID": teacherId
    }
  };

  dynamoDB.get(params, (err, data) => {
    if (err) {
      console.error('Error al obtener el profesor de la base de datos:', err);
      res.status(500).send('Error interno del servidor al obtener el profesor');
    } else if (!data.Item) {
      res.status(404).send('No se encontró el profesor con el ID proporcionado');
    } else {
      res.json(data.Item);
    }
  });
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});