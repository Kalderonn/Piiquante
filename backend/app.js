// import du framework express
const express = require("express");
// import de moongoose: est un package qui facilite les interactions avec notre base de données MongoDB.
const mongoose = require("mongoose");
// import du package dotenv
const dotenv = require('dotenv').config();
// import module node pour accéder au path de notre serveur
const path = require("path");
// import d'helmet
const helmet = require("helmet");

// import des routes sauces
const saucesRoutes = require("./routes/sauces");

// import des routes users
const usersRoutes = require("./routes/users");

//connection à la BD mongoDB grace à mangoose et la méthode connect()
mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// création de l'application express
const app = express();

// Application d'helmet
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

/**
 * middleware mis à disposition par le framework Express pour gérer la requête POST venant du front et permettre d'extraire le corps JSON
 * Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req
 */
app.use(express.json());

// middleware appliqué à toutes les requetes grace à "app.use()" du framework express
app.use((req, res, next) => {
  // Ces headers permettent :  d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
  // setHeader() : méthode node.js
  res.setHeader("Access-Control-Allow-Origin", "*");
  // d'autoriser l'ajout des headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // d'envoyer des requêtes avec les méthodes mentionnées
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// La route pour accéder au dossier images
app.use("/images", express.static(path.join(__dirname, "images")));

// la route pour les sauces
app.use("/api/sauces", saucesRoutes);

// la route pour l'authentification
app.use("/api/auth", usersRoutes);

// exportation de app pour y accéder depuis un autre fichier
module.exports = app;
