const mongoose = require('mongoose');

// package mangoose-unique-validator pour prévalider les informations avant de les enregistrer
const uniqueValidator = require('mongoose-unique-validator');

// Pour s'assurer que deux utilisateurs ne puissent pas utiliser la même adresse e-mail, 
// nous utiliserons le mot clé unique pour l'attribut email du schéma d'utilisateur userSchema
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Application du plugin "mongoose-unique-validator" sur notre userSchema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);