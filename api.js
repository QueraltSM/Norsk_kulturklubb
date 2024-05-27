const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;
const formidable = require("formidable");
const multer = require("multer");
const path = require("path");
const cachedContents = {};
const upload = multer({
  storage: multer.memoryStorage(),
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const credentialsFilePath = "C:/UNED/TFM/Norsk kulturklubb/AWS/credentials";
const credentials = fs
  .readFileSync(credentialsFilePath, "utf8")
  .split("\n")
  .reduce((acc, line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});

AWS.config.update({
  region: credentials.region,
  accessKeyId: credentials.aws_access_key_id,
  secretAccessKey: credentials.aws_secret_access_key,
});

const s3 = new AWS.S3({
  region: credentials.region,
  accessKeyId: credentials.aws_access_key_id,
  secretAccessKey: credentials.aws_secret_access_key,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();


app.get("/api/translateText", (req, res) => {
  const params = {
    Text: req.query.text,
    SourceLanguageCode: req.query.SourceLanguageCode,
    TargetLanguageCode: req.query.TargetLanguageCode,
  };
  new AWS.Translate().translateText(params, (err, data) => {
    if (err) {
      console.error("Error al traducir texto:", err);
      res.status(500).send("Internal server error al traducir texto");
    } else {
      res.json({ translatedText: data.TranslatedText });
    }
  });
});

app.get("/api/detectLanguage", (req, res) => {
  const params = {
    Text: req.query.text,
  };
  AWS.config.update({ region: "us-east-1" });
  const comprehend = new AWS.Comprehend();
  comprehend.detectDominantLanguage(params, (err, data) => {
    if (err) {
      console.error("Error al detectar el idioma:", err);
      res.status(500).send("Internal server error al detectar el idioma");
    } else {
      if (data.Languages && data.Languages.length > 0) {
        const detectedLanguage = data.Languages[0].LanguageCode;
        res.json({ detectedLanguage });
      } else {
        res.status(500).send("No se pudo detectar el idioma del texto");
      }
    }
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const params = {
    TableName: "Users",
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      res
        .status(500)
        .send("Internal server error while searching for the teacher");
    } else {
      const users = data.Items;
      const user = users.find((user) => {
        const decodedPassword = Buffer.from(user.password, "base64").toString(
          "utf-8"
        );
        return decodedPassword === password;
      });
      if (user) {
        res.status(200).send({
          ID: user.ID,
          role: user.role,
          user_full_name: user.full_name,
        });
      } else {
        res.status(401).send("Email or password incorrect");
      }
    }
  });
});

app.post("/api/insertUser", (req, res) => {
  const user = req.body;
  const params = {
    TableName: "Users",
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": user.email,
    },
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      res.status(500).send("Internal server error while verifying the user");
    } else {
      if (data.Items.length > 0) {
        res.status(409).send("The user already exists in the database");
      } else {
        insert("Users", user, res);
      }
    }
  });
});

app.post("/api/insertUserDataToServer", (req, res) => {
  insert(req.body.table, req.body.userData, res);
});

function insert(table, data, res) {
  const params = {
    TableName: table,
    Item: data,
  };
  dynamoDB.put(params, (err, data) => {
    if (err) {
      res.status(500).send("Error inserting");
    } else {
      res.send("Row was inserted");
    }
  });
}

app.post("/api/updateUserData", (req, res) => {
  const userID = req.query.id;
  if (!userID) {
    res.status(400).send("The parameter ID is required");
    return;
  }
  const userData = req.body.userData;
  const tableName = req.body.table;
  let updateExpression = "";
  let expressionAttributeValues = {};

  if (tableName === "Users") {
    updateExpression = "set full_name = :full_name, email = :email";
    expressionAttributeValues = {
      ":full_name": userData.full_name,
      ":email": userData.email,
    };
  } else if (tableName === "Collaborators") {
    updateExpression =
      "set biography = :biography, contact = :contact, public_profile = :public_profile";
    expressionAttributeValues = {
      ":biography": userData.biography,
      ":contact": userData.contact,
      ":public_profile": userData.public_profile,
    };
  } else if (tableName === "Teachers") {
    updateExpression =
      "set about_classes = :about_classes, about_me = :about_me, class_location = :class_location, class_prices = :class_prices, contact_information = :contact_information, city_residence = :city_residence, teaching_in_person = :teaching_in_person, teaching_online = :teaching_online, url_link = :url_link, public_profile = :public_profile";
    expressionAttributeValues = {
      ":about_classes": userData.about_classes,
      ":class_location": userData.class_location,
      ":class_prices": userData.class_prices,
      ":contact_information": userData.contact_information,
      ":about_me": userData.about_me,
      ":city_residence": userData.city_residence,
      ":teaching_in_person": userData.teaching_in_person,
      ":teaching_online": userData.teaching_online,
      ":url_link" : userData.url_link,
      ":public_profile": userData.public_profile,
    };
    if (userData.profile_picture != null && userData.profile_picture !== "") {
      updateExpression += ", profile_picture = :profile_picture";
      expressionAttributeValues[":profile_picture"] = userData.profile_picture;
    }
  } else if (tableName === "Students") {
    updateExpression =
      "set hobbies_and_interests = :hobbies_and_interests, language_level = :language_level";
    expressionAttributeValues = {
      ":hobbies_and_interests": userData.hobbies_and_interests,
      ":language_level": userData.language_level,
    };
  }
  const params = {
    TableName: req.query.table,
    Key: {
      ID: userID,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW",
  };
  dynamoDB.update(params, (err, data) => {
    if (err) {
      console.error("Error updating user information:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json({ success: true });
    }
  });
});

app.post("/api/updateProfileImage", multer().single("image"), (req, res) => {
  console.log("updateProfileImage")
  const image = req.file;
  if (!image) {
    console.log("no hay imagen");
    return res.status(400).send("No image");
  }
  console.log("sigo");
  const params = {
    Bucket: "norskkulturklubb",
    Key: "Users/" + req.body.key,
    Body: image.buffer,
    ACL: "public-read",
  };
  console.log(JSON.stringify(params));
  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error al subir la imagen a S3:", err);
      return res.status(500).send("Error al subir la imagen a S3");
    }
    res.status(200).json({ imageUrl: data.Location });
  });
});

app.post("/api/deleteUser", (req, res) => {
  const params = {
    TableName: "Users",
    Key: {
      ID: req.query.id,
    },
  };
  dynamoDB.delete(params, (err, dataObjects) => {
    if (err) {
      res.status(500).send("Error deleting");
    } else {
      const params = {
        TableName: req.query.role,
        Key: {
          ID: req.query.id,
        },
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

app.post("/api/deleteFromS3", (req, res) => {
    const s3Params = {
      Bucket: "norskkulturklubb",
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

app.get("/api/getUser", (req, res) => {
  const params = {
    TableName: req.query.table,
    Key: {
      ID: req.query.id,
    },
  };
  dynamoDB.get(params, (err, data) => {
    if (err) {
      console.error("Error retrieving user from the database:", err);
      res.status(500).send("Internal server error");
    } else if (!data.Item) {
      res.status(404).send("No user found");
    } else {
      res.json(data.Item);
    }
  });
});

app.get("/api/getFromURL", (req, res) => {
  const params = {
    TableName: req.query.table,
    FilterExpression: "url_link = :url_link",
    ExpressionAttributeValues: {
      ":url_link": req.query.url_link
    }
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error("Error retrieving user from the database:", err);
      res.status(500).send("Internal server error");
    } else if (data.Items.length === 0) {
      res.status(404).send("No user found");
    } else {
      res.json(data.Items[0]);
    }
  });
});

app.post("/api/uploadContent", (req, res) => {
  const params = {
    TableName: req.query.table,
    Item: req.body,
  };
  dynamoDB.put(params, (err, data) => {
    if (err) {
      res.status(500).send("Error inserting");
    } else {
      res.status(200).json({ success: true });
    }
  });
});


app.post("/api/updateContent", (req, res) => {
  const params = {
    TableName: req.query.table,
    Key: {
      ID: req.query.ID,
    },
    ExpressionAttributeValues: {},
    ReturnValues: "UPDATED_NEW",
  };
  const updateExpressionParts = [];
  if (req.query.table === "Lessons") {
    updateExpressionParts.push("title = :title");
    updateExpressionParts.push("short_description = :short_description");
    updateExpressionParts.push("description = :description");
    updateExpressionParts.push("language_level = :language_level");
    updateExpressionParts.push("content_url = :content_url");
    updateExpressionParts.push("image_url = :image_url");
    params.ExpressionAttributeValues[":title"] = req.body.title;
    params.ExpressionAttributeValues[":short_description"] = req.body.short_description;
    params.ExpressionAttributeValues[":description"] = req.body.description;
    params.ExpressionAttributeValues[":language_level"] = req.body.language_level;
    params.ExpressionAttributeValues[":content_url"] = req.body.content_url;
    params.ExpressionAttributeValues[":image_url"] = req.body.image_url;
  } else if (req.query.table === "Words") {
    const title = req.body.title;
    const meaning = req.body.meaning;
    const display_date = req.body.display_date;
    const url_link = req.body.url_link;
    updateExpressionParts.push("title = :title");
    updateExpressionParts.push("meaning = :meaning");
    updateExpressionParts.push("display_date = :display_date");
    updateExpressionParts.push("url_link = :url_link");
    params.ExpressionAttributeValues[":title"] = title;
    params.ExpressionAttributeValues[":meaning"] = meaning;
    params.ExpressionAttributeValues[":display_date"] = display_date;
    params.ExpressionAttributeValues[":url_link"] = url_link;
  } else if (req.query.table === "Culture") {
    updateExpressionParts.push("title = :title");
    updateExpressionParts.push("description = :description");
    updateExpressionParts.push("category = :category");
    updateExpressionParts.push("min_read = :min_read");
    updateExpressionParts.push("short_description = :short_description");
    updateExpressionParts.push("subcategory = :subcategory");
    updateExpressionParts.push("image_url = :image_url");
    params.ExpressionAttributeValues[":title"] =  req.body.title;
    params.ExpressionAttributeValues[":description"] =  req.body.description;
    params.ExpressionAttributeValues[":category"] =  req.body.category;
    params.ExpressionAttributeValues[":min_read"] =  req.body.min_read;
    params.ExpressionAttributeValues[":short_description"] =  req.body.short_description;
    params.ExpressionAttributeValues[":subcategory"] =  req.body.subcategory;
    params.ExpressionAttributeValues[":image_url"] = req.body.image_url;
  } else if (req.query.table === "Events") {
    updateExpressionParts.push("title = :title");
    updateExpressionParts.push("description = :description");
    updateExpressionParts.push("platform_url = :platform_url");
    updateExpressionParts.push("celebration_date = :celebration_date");
    updateExpressionParts.push("image_url = :image_url");
    updateExpressionParts.push("category = :category");
    params.ExpressionAttributeValues[":title"] =  req.body.title;
    params.ExpressionAttributeValues[":description"] =  req.body.description;
    params.ExpressionAttributeValues[":platform_url"] =  req.body.platform_url;
    params.ExpressionAttributeValues[":celebration_date"] =  req.body.celebration_date;
    params.ExpressionAttributeValues[":image_url"] = req.body.image_url;
    params.ExpressionAttributeValues[":category"] = req.body.category;
  }
  params.UpdateExpression = "SET " + updateExpressionParts.join(", ");
  dynamoDB.update(params, (err, data) => {
    if (err) {
      console.error("Error updating item in DynamoDB:", err);
      return res.status(500).send("Error updating item in DynamoDB");
    } else {
      res.status(200).json({ success: true, updatedData: data.Attributes });
    }
  });
});

app.post(
  "/api/uploadFileLesson",
  upload.fields([{ name: "file" }, { name: "image" }]),
  (req, res) => {
    if (!req.files || !req.files.file || !req.files.image) {
      return res.status(400).send("No file or image uploaded");
    }
    const file = req.files.file[0];
    const image = req.files.image[0];
    const fileParams = {
      Bucket: "norskkulturklubb",
      Key: "Lessons/" + req.query.filename,
      Body: file.buffer,
      ACL: "public-read",
    };
    const imageParams = {
      Bucket: "norskkulturklubb",
      Key: "Lessons/" + req.query.image_filename,
      Body: image.buffer,
      ACL: "public-read",
    };
    s3.upload(fileParams, (err, fileData) => {
      if (err) {
        console.error("Error uploading file to S3:", err);
        return res.status(500).send("Error uploading file to S3");
      }
      s3.upload(imageParams, (err, imageData) => {
        if (err) {
          console.error("Error uploading image to S3:", err);
          return res.status(500).send("Error uploading image to S3");
        }
        res
          .status(200)
          .json({ fileUrl: fileData.Location, imageUrl: imageData.Location });
      });
    });
  }
);

app.post("/api/uploadFile", upload.single("file"), (req, res) => {
  const file = req.file;
  const params = {
    Bucket: "norskkulturklubb",
    Key: req.query.key + "/" + req.query.filename,
    Body: file.buffer,
    ACL: "public-read",
  };
  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error uploading to S3:", err);
      return res.status(500).send("Error uploading image to S3");
    }
    res.status(200).json({ fileUrl: data.Location });
  });
});

app.post("/api/uploadImage", upload.single("image"), (req, res) => {
  const image = req.file;
  const params = {
    Bucket: "norskkulturklubb",
    Key: req.query.key + "/" + req.query.filename,
    Body: image.buffer,
    ACL: "public-read",
  };
  console.log(req.query.key + "/" + req.query.filename);
  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error uploading to S3:", err);
      return res.status(500).send("Error uploading image to S3");
    }
    console.log("imageurl:"+data.Location);
    res.status(200).json({ imageUrl: data.Location });
  });
});


app.get("/api/getContent", (req, res) => {
  const params = {
    TableName: req.query.table,
    Key: {
      ID: req.query.id,
    },
  };
  dynamoDB.get(params, (err, data) => {
    if (err) {
      res.status(500).send("Error in server");
    } else {
      res.json(data.Item);
    }
  });
});

app.get("/api/getAllContents", (req, res) => {
  const params = {
    TableName: req.query.table,
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      res.status(500).send("Internal server error");
    } else {
      res.json(data);
    }
  });
});

app.get("/api/getMyContributions", (req, res) => {
  let filterExpression;
  if (req.query.table === "Culture" || req.query.table === "Events") {
    filterExpression = "user_id = :id";
  } else {
    filterExpression = "teacher_id = :id";
  }
  const params = {
    TableName: req.query.table,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: {
      ":id": req.query.user_id,
    },
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error("Error scanning the table:", err);
      res.status(500).send("Internal server error");
    } else {
      res.json(data);
    }
  });
});

app.post("/api/deleteLesson", (req, res) => {
  const params = {
    TableName: "Lessons",
    Key: {
      ID: req.body.id,
    },
  };
  dynamoDB.delete(params, (err, dataObjects) => {
    if (err) {
      res.status(500).send("Error deleting");
    } else {
      const s3Params = {
        Bucket: "norskkulturklubb",
        Key: "Lessons/" + req.body.teacher_id + "/" + req.body.content_url,
      };
      s3.deleteObject(s3Params, (errS3, data) => {
        if (errS3) {
          res.status(500).send("Error deleting from S3");
        } else {
          const s3ImageParams = {
            Bucket: "norskkulturklubb",
            Key: "Lesson/" + req.body.image_url,
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

app.post("/api/uploadEvent", (req, res) => {
  const params = {
    TableName: "Events",
    Item: req.body,
  };
  dynamoDB.put(params, (err, data) => {
    if (err) {
      res.status(500).send("Error inserting");
    } else {
      res.status(200).json({ success: true });
    }
  });
});

app.post("/api/uploadPostImage", multer().single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  const params = {
    Bucket: "norskkulturklubb",
    Key: "Culture/" + req.query.filename,
    Body: req.file.buffer,
    ACL: "public-read",
  };
  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error al subir el fichero a S3:", err);
      return res.status(500).send("Error al subir el fichero a S3");
    }
    res.status(200).json({ fileUrl: data.Location });
  });
});


app.post("/api/deleteCulture", (req, res) => {
  const params = {
    TableName: "Culture",
    Key: {
      ID: req.body.id,
    },
  };
  dynamoDB.delete(params, (err, dataObjects) => {
    if (err) {
      res.status(500).send("Error deleting");
    } else {
      const s3Params = {
        Bucket: "norskkulturklubb",
        Key: "Culture/" + req.body.content_url,
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

app.post("/api/deleteContent", (req, res) => {
  const params = {
    TableName: req.body.table,
    Key: {
      ID: req.body.id,
    },
  };
  dynamoDB.delete(params, (err, dataObjects) => {
    if (err) {
      res.status(500).send("/api/deleteContent: Error deleting");
    } else {
      res.status(200).send("/api/deleteContent: Row deleted");
    }
  });
});

app.post("/api/deleteAllContentsS3", async (req, res) => {
  const prefix = `${req.body.key}/${req.body.url}/`;
  console.log("Prefix: " + prefix);

  try {
    // Listar todos los objetos con el prefijo especificado
    const listParams = {
      Bucket: "norskkulturklubb",
      Prefix: prefix,
    };

    console.log(JSON.stringify(listParams));
    
    let listedObjects;
    let deleteParams = {
      Bucket: "norskkulturklubb",
      Delete: { Objects: [] }
    };

    do {
      listedObjects = await s3.listObjectsV2(listParams).promise();

      if (listedObjects.Contents.length === 0 && deleteParams.Delete.Objects.length === 0) {
        return res.status(404).send("/api/deleteAllContentsS3: No content found");
      }

      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });

      // Continuar listando si hay más de 1000 objetos
      listParams.ContinuationToken = listedObjects.NextContinuationToken;

    } while (listedObjects.IsTruncated);

    // Eliminar los objetos
    if (deleteParams.Delete.Objects.length > 0) {
      await s3.deleteObjects(deleteParams).promise();
    }

    res.status(200).send("/api/deleteAllContentsS3: Content deleted");

  } catch (errS3) {
    console.error("Error deleting objects from S3:", errS3);
    res.status(500).send("/api/deleteAllContentsS3: Error deleting from S3");
  }
});

app.post("/api/deleteContentS3", (req, res) => {
  const s3Params = {
    Bucket: "norskkulturklubb",
    Key: req.body.key + "/" + req.body.url,
  };
  s3.deleteObject(s3Params, (errS3, data) => {
    if (errS3) {
      res.status(500).send("/api/deleteContentS3: Error deleting from S3");
    } else {
      res.status(200).send("/api/deleteContentS3: Content deleted");
    }
  });
});

app.get("/Edit/:type/:url", (req, res) => {
  const title = "/Edit/" + req.params.type + "/" + req.params.url;
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("edit-content.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/Events", (req, res) => {
  const title = "/Events";
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("events.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/Culture", (req, res) => {
  const title = "/Culture";
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("culture.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/Lessons", (req, res) => {
  const title = "/Lessons";
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("lessons.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/Teachers/:url", (req, res) => {
  const title = "/Teachers/" + req.params.url;
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("teacher.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/Teachers", (req, res) => {
  const title = "/Teachers";
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("teachers.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/Culture/:url", (req, res) => {
  const title = "/Culture/" + req.params.url;
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("post.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/Lessons/:url", (req, res) => {
  const title = "/Lessons/" + req.params.url;
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("lesson.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/Account", (req, res) => {
  const title = "/Account";
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("account.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/Translator", (req, res) => {
  const title = "/Translator";
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("translator.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/Share", (req, res) => {
  const title = "/Share";
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("share-content.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/users/:title", (req, res) => {
  const title = "/users/" + req.params.title;
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("user.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/404", (req, res) => {
  const title = "/404";
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("404.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/Contributions", (req, res) => {
  const title = "/Contributions";
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("contributions.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});

app.get("/signup", (req, res) => {
  const title = "/signup";
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("signup.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});


app.get("/login", (req, res) => {
  const title = "/login";
  if (cachedContents[title]) {
    return res.send(cachedContents[title]);
  }
  const HTML_content = fs.readFileSync("login.html", "utf8");
  cachedContents[title] = HTML_content;
  res.send(HTML_content);
});


app.use(express.static(path.join(__dirname, "")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
