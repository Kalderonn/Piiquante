const mongoose = require('mongoose');

/**
 * nous créons un schéma de données qui contient les champs souhaités pour chaque sauce,
 * indique leur type ainsi que leur caractère (obligatoire ou non). 
 * Pour cela, on utilise la méthode Schema mise à disposition par Mongoose qui permet de créer un schéma de données pour notre base de données MongoDB.. 
 * Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose ;
 */
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description :{ type:String, required:true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked:{ type: [String] },
  usersDisliked:{ type: [String] },
});
// ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « sauce », le rendant par là même disponible pour notre application Express.
module.exports = mongoose.model('Sauce', sauceSchema);