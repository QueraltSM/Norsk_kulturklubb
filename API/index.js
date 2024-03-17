const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const formidable = require('formidable');

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

const s3 = new AWS.S3({
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
    TableName: 'Users',
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      res.status(500).send('Internal server error while searching for the teacher');
    } else {
      const users = data.Items;
      const user = users.find(user => {
        const decodedPassword = Buffer.from(user.password, 'base64').toString('utf-8');
        return decodedPassword === password;
      });
      if (user) {
        res.status(200).send({
          ID: user.ID,
          role: user.role,
          message: `Hallo ${user.name}`
        });
      } else {
        res.status(401).send('Email or password incorrect');
      }
    }
  });
});

app.post('/api/insertUser', (req, res) => {
  const user = req.body;
  const params = {
    TableName: 'Users',
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': user.email
    }
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      res.status(500).send('Internal server error while verifying the user');
    } else {
      if (data.Items.length > 0) {
        res.status(409).send('The user already exists in the database');
      } else {
        insert('Users', user, res);
      }
    }
  });
});

app.post('/api/insertUserDataToServer', (req, res) => {
  insert(req.body.table, req.body.userData, res);
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

app.post('/api/updateUserData', (req, res) => {
  const userID = req.query.id;
  if (!userID) {
    res.status(400).send('The parameter ID is required');
    return;
  }
  const userData = req.body.userData;
  const tableName = req.body.table;
  const params = {
    TableName: tableName,
    Key: {
      "ID": userID
    },
    UpdateExpression: "set about_classes = :about_classes, about_teacher = :about_teacher, class_location = :class_location, class_prices = :class_prices, contact_information = :contact_information, public_profile = :public_profile",
    ExpressionAttributeValues: {
      ":about_classes": userData.about_classes,
      ":about_teacher": userData.about_teacher,
      ":class_location": userData.class_location,
      ":class_prices": userData.class_prices,
      ":contact_information": userData.contact_information,
      ":public_profile": userData.public_profile
    },
    ReturnValues: "UPDATED_NEW"
  };
  dynamoDB.update(params, (err, data) => {
    if (err) {
      console.error('Error al actualizar la información del usuario:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json({ success: true });
    }
  });
});

app.post('/api/updateProfileImage', (req, res) => {
  /*const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log('Error al parsear el formulario:' + err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const imageFilePath = files.image.path;
    console.log(imageFilePath);

    const uploadParams = {
      Bucket: 'norskkulturklubb',
      Key: 'Teachers profile image/' + req.query.filename, // Define el nombre del archivo en S3
      Body: fs.createReadStream(imageFilePath), // Crea un stream de lectura del archivo
      ACL: 'public-read' // Opcional: establece los permisos de lectura pública
    };*/

    
    console.log("paso esto")

    const params = {
      Bucket: 'norskkulturklubb',
      Key: 'Teachers profile image/' + req.query.filename, 
      Body: req.body.formData,
      ACL: 'public-read' // Optional: set the file permissions
  };

  console.log("luego esto")

    // Sube el archivo a S3
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error al subir la imagen a S3:', err);
        res.status(500).send('Error al subir la imagen a S3');
      } else {
        console.log('Imagen subida a S3 con éxito:', data.Location);
        // Envía la URL de la imagen en S3 como respuesta
        res.status(200).json({ imageUrl: data.Location });
      }
    });

  //});
});


app.get('/api/getCulture', (req, res) => {
  const params = {
    TableName: 'Culture',
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

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});