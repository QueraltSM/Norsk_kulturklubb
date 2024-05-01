const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;
const formidable = require('formidable');
const multer = require('multer');
const path = require('path');
const cachedContents = {};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
      console.error('Error scanning the table:', err);
      res.status(500).send('Internal server error');
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
      console.error('Error scanning the table:', err);
      res.status(500).send('Internal server error');
    } else {
      res.json(data);
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
      res.status(500).send('Internal server error al traducir texto');
    } else {
      res.json({ translatedText: data.TranslatedText });
    }
  });
});

app.get('/api/detectLanguage', (req, res) => {
  const params = {
    Text: req.query.text,
  };

  AWS.config.update({ region: 'us-east-1' });
  
  const comprehend = new AWS.Comprehend();

  comprehend.detectDominantLanguage(params, (err, data) => {
    if (err) {
      console.error('Error al detectar el idioma:', err);
      res.status(500).send('Internal server error al detectar el idioma');
    } else {
      if (data.Languages && data.Languages.length > 0) {
        const detectedLanguage = data.Languages[0].LanguageCode;
        res.json({ detectedLanguage });
      } else {
        res.status(500).send('No se pudo detectar el idioma del texto');
      }
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
          user_first_name: user.first_name
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
  let updateExpression = "";
  let expressionAttributeValues = {};

  if (tableName === "Users") {
    updateExpression = "set first_name = :first_name, email = :email";
    expressionAttributeValues = {
      ":first_name": userData.first_name,
      ":email": userData.email
    };
  } else if (tableName === "Collaborators") {
    updateExpression = "set biography = :biography, contact = :contact";
    expressionAttributeValues = {
      ":biography": userData.biography,
      ":contact": userData.contact
    };
  } else if (tableName === "Teachers") {
    updateExpression = "set about_classes = :about_classes, about_teacher = :about_teacher, class_location = :class_location, class_prices = :class_prices, contact_information = :contact_information, city_residence = :city_residence, short_description = :short_description, hourly_rate = :hourly_rate, teaching_in_person = :teaching_in_person, teaching_online = :teaching_online, public_profile = :public_profile";
    expressionAttributeValues = {
      ":about_classes": userData.about_classes,
      ":about_teacher": userData.about_teacher,
      ":class_location": userData.class_location,
      ":class_prices": userData.class_prices,
      ":hourly_rate" : userData.hourly_rate,
      ":contact_information": userData.contact_information,
      ":short_description" : userData.short_description,
      ":city_residence" : userData.city_residence,
      ":teaching_in_person" : userData.teaching_in_person,
      ":teaching_online" : userData.teaching_online,
      ":public_profile": userData.public_profile,
    };
    if (userData.profile_picture != null && userData.profile_picture !== "") {
      updateExpression += ", profile_picture = :profile_picture";
      expressionAttributeValues[":profile_picture"] = userData.profile_picture;
    }
  }
  const params = {
    TableName: req.query.table,
    Key: {
      "ID": userID
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW"
  };
  dynamoDB.update(params, (err, data) => {
    if (err) {
      console.error('Error updating user information:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json({ success: true });
    }
  });
});


app.post('/api/updateProfileImage', multer().single('image'), (req, res) => {
  const image = req.file;
  if (!image) {
      return res.status(400).send('No image');
  }
  const params = {
      Bucket: 'norskkulturklubb',
      Key: 'Users/' + req.query.filename, 
      Body: image.buffer,
      ACL: 'public-read'
  };

  s3.upload(params, (err, data) => {
      if (err) {
          console.error('Error al subir la imagen a S3:', err);
          return res.status(500).send('Error al subir la imagen a S3');
      }
      res.status(200).json({ imageUrl: data.Location });
  });
});

app.get('/api/getCultureEntries', (req, res) => {
  const params = {
    TableName: 'Culture',
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error('Error scanning the table:', err);
      res.status(500).send('Internal server error');
    } else {
      res.json(data);
    }
  });
});

app.get('/api/getCulture', (req, res) => {
  if (!req.query.id) {
    res.status(400).send('ID is required');
    return;
  }
  const params = {
    TableName: 'Culture',
    Key: {
      "ID": req.query.id
    }
  };
  dynamoDB.get(params, (err, data) => {
    if (err) {
      console.error('Error al obtener el profesor de la base de datos:', err);
      res.status(500).send('Internal server error al obtener el profesor');
    } else if (!data.Item) {
      res.status(404).send('No se encontró el profesor con el ID proporcionado');
    } else {
      res.json(data.Item);
    }
  });
});


app.post('/api/deleteUser', (req, res) => {
  const params = {
    TableName: 'Users',
    Key: {
      'ID':  req.query.id
    }
  };
  dynamoDB.delete(params, (err, dataObjects) => {
    if (err) {
      res.status(500).send("Error deleting");
    } else {
      const params = {
        TableName: req.query.role,
        Key: {
          'ID': req.query.id
        }
      };
      dynamoDB.delete(params, (err, data) => {
        if (err) {
          res.status(500).send("Error deleting");
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});


app.post('/api/deleteFromS3', (req, res) => {
  dynamoDB.delete(params, (err, dataObjects) => {
    const s3Params = {
      Bucket: 'norskkulturklubb',
      Key: req.query.folder + "/" + req.query.url,
    };
    s3.deleteObject(s3Params, (errS3, data) => {
      if (errS3) {
        res.status(500).send("Error deleting from S3");
      } else {
        res.send("Objects were deleted");
      }
    });
  });
});

app.get('/api/getUser', (req, res) => {
  const params = {
    TableName: req.query.table,
    Key: {
      "ID": req.query.id
    }
  };
  dynamoDB.get(params, (err, data) => {
    if (err) {
      console.error('Error retrieving user from the database:', err);
      res.status(500).send('Internal server error');
    } else if (!data.Item) {
      res.status(404).send('No user found');
    } else {
      res.json(data.Item);
    }
  });
});

app.get('/api/getWords', (req, res) => {
  const params = {
    TableName: 'Words',
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error('Error scanning the table:', err);
      res.status(500).send('Internal server error');
    } else {
      res.json(data);
    }
  });
});

app.post('/api/uploadWord', (req, res) => {
  const params = {
    TableName: "Words",
    Item: req.body
  };
  dynamoDB.put(params, (err, data) => {
    if (err) {
      res.status(500).send("Error inserting");
    } else {
      res.status(200).json({ success: true });
    }
  });
});

app.post('/api/uploadLesson', (req, res) => {
  const params = {
    TableName: "Lessons",
    Item: req.body
  };
  dynamoDB.put(params, (err, data) => {
    if (err) {
      res.status(500).send("Error inserting");
    } else {
      res.status(200).json({ success: true });
    }
  });
});

const upload = multer({
  storage: multer.memoryStorage(),
});

app.post('/api/uploadFileLesson', upload.fields([{ name: 'file' }, { name: 'image' }]), (req, res) => {
  if (!req.files || !req.files.file || !req.files.image) {
    return res.status(400).send('No file or image uploaded');
  }
  const file = req.files.file[0];
  const image = req.files.image[0];
  const fileParams = {
      Bucket: 'norskkulturklubb',
      Key: 'Lessons/' + req.query.filename, 
      Body: file.buffer,
      ACL: 'public-read'
  };
  const imageParams = {
      Bucket: 'norskkulturklubb',
      Key: 'Lesson-Images/' + req.query.image_filename, 
      Body: image.buffer,
      ACL: 'public-read'
  };
  s3.upload(fileParams, (err, fileData) => {
      if (err) {
          console.error('Error uploading file to S3:', err);
          return res.status(500).send('Error uploading file to S3');
      }
      s3.upload(imageParams, (err, imageData) => {
          if (err) {
              console.error('Error uploading image to S3:', err);
              return res.status(500).send('Error uploading image to S3');
          }
          res.status(200).json({ fileUrl: fileData.Location, imageUrl: imageData.Location });
      });
  });
});

app.get('/api/getLessons', (req, res) => {
  const params = {
    TableName: 'Lessons',
  };
  console.log("params:"+JSON.stringify(params));
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      res.status(500).send('Internal server error');
    } else {
      res.json(data);
    }
  });
});


app.get('/api/getLesson', (req, res) => {
  const params = {
    TableName: "Lessons",
    Key: {
      "ID": req.query.id
    }
  };
  dynamoDB.get(params, (err, data) => {
    if (err) {
      console.error('Error al obtener el profesor de la base de datos:', err);
      res.status(500).send('Internal server error al obtener el profesor');
    } else if (!data.Item) {
      res.status(404).send('No se encontró el profesor con el ID proporcionado');
    } else {
      res.json(data.Item);
    }
  });
});

app.get('/api/getMyContributions', (req, res) => {
  let filterExpression;
  if (req.query.table === 'Culture' || req.query.table === 'Events') {
    filterExpression = 'user_id = :id';
  } else {
    filterExpression = 'teacher_id = :id';
  }
  const params = {
    TableName: req.query.table,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: {
      ':id': req.query.user_id
    }
  };
  console.log(JSON.stringify(params))
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error('Error scanning the table:', err);
      res.status(500).send('Internal server error');
    } else {
      res.json(data);
    }
  });
});

app.post('/api/deleteLesson', (req, res) => {
  const params = {
    TableName: 'Lessons',
    Key: {
      'ID': req.body.id
    }
  };
  dynamoDB.delete(params, (err, dataObjects) => {
    if (err) {
      res.status(500).send("Error deleting");
    } else {
      const s3Params = {
        Bucket: 'norskkulturklubb',
        Key: 'Lessons/' + req.body.content_url,
      };
      s3.deleteObject(s3Params, (errS3, data) => {
        if (errS3) {
          res.status(500).send("Error deleting from S3");
        } else {
          const s3ImageParams = {
            Bucket: 'norskkulturklubb',
            Key: 'Lesson-Images/' + req.body.header_image,
          };
          s3.deleteObject(s3ImageParams, (errS3Image, data) => {
            if (errS3Image) {
              res.status(500).send("Error deleting from S3");
            } else {
              res.send("Objects were deleted");
            }
          });
        }
      });
    }
  });
});

app.post('/api/uploadEvent', (req, res) => {
  const params = {
    TableName: "Events",
    Item: req.body
  };
  dynamoDB.put(params, (err, data) => {
    if (err) {
      res.status(500).send("Error inserting");
    } else {
      res.status(200).json({ success: true });
    }
  });
});

app.post('/api/uploadPostImage', multer().single('file'), (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded');
  }
  const params = {
      Bucket: 'norskkulturklubb',
      Key: 'Culture/' + req.query.filename, 
      Body: req.file.buffer,
      ACL: 'public-read'
  };
  console.log("params:"+JSON.stringify(params));
  s3.upload(params, (err, data) => {
      if (err) {
          console.error('Error al subir el fichero a S3:', err);
          return res.status(500).send('Error al subir el fichero a S3');
      }
      res.status(200).json({ fileUrl: data.Location });
  });
});

app.post('/api/uploadPost', (req, res) => {
  const params = {
    TableName: "Culture",
    Item: req.body
  };
  dynamoDB.put(params, (err, data) => {
    if (err) {
      res.status(500).send("Error inserting");
    } else {
      res.status(200).json({ success: true });
    }
  });
});

app.post('/api/deleteCulture', (req, res) => {
  const params = {
    TableName: 'Culture',
    Key: {
      'ID': req.body.id
    }
  };
  dynamoDB.delete(params, (err, dataObjects) => {
    if (err) {
      res.status(500).send("Error deleting");
    } else {
      const s3Params = {
        Bucket: 'norskkulturklubb',
        Key: 'Culture/' + req.body.content_url,
      };
      s3.deleteObject(s3Params, (errS3, data) => {
        if (errS3) {
          res.status(500).send("Error deleting from S3");
        } else {
          res.send("Objects were deleted");
        }
      });
    }
  });
});

app.get('/Culture/:title', (req, res) => {
  const title = req.params.title;
  if (cachedContents[title]) {
    console.log("Enviando contenido en caché para", title);
    return res.send(cachedContents[title]);
  }
  console.log("Añadiendo a caché y enviando contenido para", title);
  const contenidoHTML = fs.readFileSync('post.html', 'utf8');
  cachedContents[title] = contenidoHTML;
  res.send(contenidoHTML);
});

app.use(express.static(path.join(__dirname, '')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});