const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

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

app.get('/api/translateText', (req, res) => {
  const params = {
    Text:  req.query.text,
    SourceLanguageCode: req.query.SourceLanguageCode,
    TargetLanguageCode: req.query.TargetLanguageCode,
  };
  new AWS.Translate().translateText(params, (err, data) => {
    if (err) {
      console.error('Error al traducir texto:', err);
      res.status(500).send('Error interno del servidor al traducir texto');
    } else {
      res.json({ translatedText: data.TranslatedText });
    }
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const params = {
    TableName: 'Teachers',
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      res.status(500).send('Internal server error while searching for the teacher');
    } else {
      const teachers = data.Items;
      const teacher = teachers.find(teacher => {
        const decodedPassword = Buffer.from(teacher.password, 'base64').toString('utf-8');
        return decodedPassword === password;
      });
      if (teacher) {
        res.send('Successful sign in');
      } else {
        res.status(401).send('Email or password incorrect');
      }
    }
  });
});

app.post('/api/insertTeacher', (req, res) => {
  const teacherData = req.body;
  const params = {
    TableName: 'Teachers',
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': teacherData.email
    }
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      res.status(500).send('Internal server error while verifying the user');
    } else {
      if (data.Items.length > 0) {
        res.status(409).send('The user already exists in the database');
      } else {
        insert('Teachers', teacherData, res);
      }
    }
  });
});

function insert(table, data, res) {
  const params = {
    TableName: table,
    Item: data
  };
  dynamoDB.put(params, (err, data) => {
    if (err) {
      res.status(500).send("Error inserting");
    } else {
      res.send("Row was inserted");
    }
  });
}

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});