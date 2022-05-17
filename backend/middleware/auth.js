const jwt = require("jsonwebtoken");

/**
 * Dans ce middleware :
 * nous extrayons le token du header Authorization de la requête entrante. N'oubliez pas qu'il contiendra également le mot-clé Bearer
 * Nous utilisons donc la fonction split pour récupérer tout après l'espace dans le header. Les erreurs générées ici s'afficheront dans le bloc catch ;
 * nous utilisons ensuite la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée ;
 * nous extrayons l'ID utilisateur de notre token ;
 * si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur ;
 * dans le cas contraire, tout fonctionne, et notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next() .
 */
module.exports = (req, res, next) => {
  try {
    // nous extrayons le token du header Authorization de la requête entrante.
    // Nous utilisons donc la fonction split pour récupérer tout après l'espace dans le header
    const token = req.headers.authorization.split(" ")[1];
    // nous utilisons ensuite la fonction verify pour décoder notre token.
    const decodedToken = jwt.verify(token, `${process.env.JWT_KEY_TOKEN}`);
    // nous extrayons l'ID utilisateur de notre token
    const userId = decodedToken.userId;
    // Dans notre middleware d'authentification, nous ajoutons un objet  auth  à l'objet de requête qui contient le  userId  extrait du token :
    req.auth = { userId };
    // Si la requête contient un userId et que ce userId est différent de celui extrait du token
    if (req.body.userId && (req.body.userId !== userId)) {
      // alors on renvoie un message d'erreur
      throw "L'indentifiant de l'utilisateur est invalide";
      //sinon on passe au middleware suivant avec la fonction next()
    } else {
      next();
    }
  } catch (error){
    res.status(403).json({
      message : "Requête non authentifiée !",
      error : error
    });
  }
};
