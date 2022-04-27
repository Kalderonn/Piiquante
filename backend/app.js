const express = require("express");
// import de moongoose: est un package qui facilite les interactions avec notre base de données MongoDB.
const mongoose = require("mongoose");
// import pour accéder au path de notre serveur
const path = require("path");

// import du router sauces
const saucesRoutes = require("./routes/sauces");

// import du router users
const usersRoutes = require("./routes/users");

mongoose
  .connect(
    "mongodb+srv://Mikael:12345678Me@cluster0.k935t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

//  middleware mis à disposition par le framework Express pour gérer la requête POST venant du front et permettre d'extraire le corps JSON
// Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req
app.use(express.json());

// middleware appliqué à toutes les requetes grace à "app.use()"
// Ces headers permettent :
app.use((req, res, next) => {
  // d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
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

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", usersRoutes);

module.exports = app;
