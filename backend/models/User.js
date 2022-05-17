const mongoose = require('mongoose');

/**
 * package mangoose-unique-validator pour prévalider les informations avant de les enregistrer
 * pour ne pas enregistrer 2 fois le meme mail dans la BD
 */
const uniqueValidator = require('mongoose-unique-validator');

/**
 * Pour s'assurer que deux utilisateurs ne puissent pas utiliser la même adresse e-mail, 
 * nous utiliserons le mot clé unique pour l'attribut email du schéma d'utilisateur userSchema
 */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/**
 * Application du plugin "mongoose-unique-validator" sur notre userSchema
 * s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.
 */
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);