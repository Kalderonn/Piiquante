// importation de password-validator
const passwordValidator = require("password-validator");

// création du password schéma
const passwordSchema = new passwordValidator();

// le schéma que doit respecter le mot de passe
passwordSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase(1) // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(1) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

// vérification de la qualité du password par rapport au schéma
module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    res
      .status(400)
      .json({
        error:
          "le mot de passe doit contenir minimum 8 caractères, 1 majuscule et 1 chiffre",
      });
  }
};
