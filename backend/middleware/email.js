// import de validator pour vérifier que l'utilisateur saisi bien un email
const validator = require("validator");

// vérification que l'email envoyé dans la requete est bien un email valide
module.exports = (req, res, next) => {
  // récupération de l'email contenu dans le req.body de la requete
  const { email } = req.body;
  // vérification de l'email grace à la méthode "isEmail" du package validator
  // si l'email est valide,on peut passer au middleware suivant grace à next()
  if (validator.isEmail(email)) {
    next();
    // sinon on retourne un message d'erreur
  } else {
    return res.status(400).json({ Error: `l'email ${email} n'est pas valide` });
  }
};
