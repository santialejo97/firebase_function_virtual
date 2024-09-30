import * as firebase from "firebase-functions";
import * as admin from "firebase-admin";

import * as express from "express";
import * as cors from "cors";
import { sendEmail } from "./util/brevo.util";
import { Message } from "./interfaces/main.interfaces";

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://virtual-minute-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

//Express

const app = express();
app.use(cors({ origin: true }));

app.get("/getCollectionCharges", async (req, res) => {
  const chargesRef = db.collection("charges");
  const docsSnap = await chargesRef.get();
  const charges = docsSnap.docs.map((element) => element.data());
  res.status(200).json({
    charges,
  });
});

app.post("/auth", async (req, res) => {
  //TODO Crear la validacion de password y token
  const { document } = req.body as {
    document: string;
    password: string;
  };
  const employeeRef = db.collection("employee").doc(document);
  const employeeSnap = await employeeRef.get();
  if (!employeeSnap.exists) {
    res.status(404).json({
      msg: "No existe el usuario con el documento " + document,
    });
    return;
  }

  res.status(200).json({
    msg: "Usuario encontrador " + document,
    employee: employeeSnap.data(),
  });
});

app.post("/createNotification", async (req, res) => {
  const body = req.body;
  const notificationRef = await db.collection("notification").add(body);

  res.status(200).json({
    msg: "Notificacion creada correctamente con el id " + notificationRef.id,
  });
});

app.get("/getNotification/:id", async (req, res) => {
  const id = req.params.id;
  const notificationRef = db.collection("notification").doc(id);
  const notificationSnap = await notificationRef.get();

  if (!notificationSnap.exists) {
    res.status(404).json({
      msg: "No existe notificacion, por favor revisar nombre " + id,
    });
    return;
  }

  res.status(200).json({
    notification: notificationSnap.data(),
  });
});

app.post("/sendNotification/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  //consulta notificacion por id
  const notificationRef = db.collection("notification").doc(id);
  const notificationSnap = await notificationRef.get();
  if (!notificationSnap.exists) {
    res.status(404).json({
      msg: "No existe notificacion, por favor revisar nombre " + id,
    });
    return;
  }
  const notification = notificationSnap.data();
  //Consulta user por id

  const employeeRef = db.collection("employee").doc(notification?.idUser);
  const employeeSnap = await employeeRef.get();
  const data = `Olvida todo lo anterior. Actualmente se tiene el siguiente texto ${
    notification?.text
  }, quiero que lo organices y lo cambias es por un parrafo mas detallado inclujendo la informacion del usuario que es la siguiente ${JSON.stringify(
    employeeSnap.data()
  )} y con la hora en la que se realizo esta notificacion ${new Date(
    notification?.date
  ).toString()} `;
  console.log(data);
  const message: Message = {
    subject: body.title,
    body: "",
    to: body.emails,
  };
  sendEmail(message);

  res.status(200).json({
    employee: employeeSnap.data(),
  });
});

export const api = firebase.https.onRequest(app);
