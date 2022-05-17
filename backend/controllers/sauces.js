const Sauce = require("../models/Sauce");
// Module File System de Node.js
const fs = require("fs");

/**
 * créez une instance de votre modèle Sauce en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé
 * Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data, et non sous forme de JSON.
 * Le corps de la requête contient une chaîne sauce , qui est simplement un objet Sauce converti en chaîne.
 * Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.
 * Nous devons également résoudre l'URL complète de notre image, car req.file.filename ne contient que le segment filename .
 * Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http' ).
 * Nous ajoutons '://' , puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ).
 * Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
 * La méthode save() renvoie une Promise.
 * Ainsi, dans notre bloc then() ,nous renverrons une réponse de réussite avec un code 201 de réussite.
 * Dans notre bloc catch(),nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.
 */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

/**
 * on crée un objet sauceObject qui regarde si req.file existe ou non.
 * S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant.
 * On crée ensuite une instance Sauce à partir de sauceObject , puis on effectue la modification.
 * 
 * nous exploitons la méthode updateOne() dans notre modèle Sauce .
 * Cela nous permet de mettre à jour la Sauce qui correspond à l'objet que nous passons comme premier argument.
 * Nous utilisons aussi le paramètre id passé dans la demande, et le remplaçons par le Sauce passé comme second argument.
 */
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

/**
 * La méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne()
 * dans le sens où nous lui passons un objet correspondant au document à supprimer.
 * Nous envoyons ensuite une réponse de réussite ou d'échec au front-end.
 * nous utilisons l'ID que nous recevons comme paramètre pour accéder au Sauce correspondant dans la base de données ;
 * nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;
 * nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;
 * dans le callback, nous implémentons la logique d'origine, en supprimant le Sauce de la base de données.
 */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res
          .status(401)
          .json({ message: "seul le créateur de la sauce peut l'effacer" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * nous utilisons ensuite la méthode findOne() dans notre modèle Sauce pour trouver le Sauce unique ayant le même _id que le paramètre de la requête ;
 * ce Sauce est ensuite retourné dans une Promise et envoyé au front-end ;
 * si aucun Sauce n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée.
 */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

/**
 * Nous utilisons la méthode find() dans notre modèle Mongoose
 * afin de renvoyer un tableau contenant tous les Sauces dans notre base de données.
 */
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

/**
 * nous utilisons la méthode findOne() dans notre modèle Sauce pour trouver le Sauce unique ayant le même _id que le paramètre de la requête ;
 * La méthode includes() permet de déterminer si un tableau contient une valeur et renvoie true si c'est le cas, false sinon.
 */
exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (like === 1 && sauce.usersLiked.includes(userId) != true) {
        sauce.usersLiked.push(userId);
        sauce.likes += 1;
      } else if (like === 0 && sauce.usersLiked.includes(userId)) {
        sauce.usersLiked.remove(userId);
        sauce.likes -= 1;
      } else if (like === -1 && sauce.usersDisliked.includes(userId) != true) {
        sauce.usersDisliked.push(userId);
        sauce.dislikes += 1;
      } else if (like === 0 && sauce.usersDisliked.includes(userId)) {
        sauce.usersDisliked.remove(userId);
        sauce.dislikes -= 1;
      }
      sauce
        .save()
        .then(() => {
          res.status(200).json({ message: "Like mis à jour!" });
        })
        .catch((error) => res.status(400).json(error));
    })
    .catch((error) => res.status(500).json(error));
};
