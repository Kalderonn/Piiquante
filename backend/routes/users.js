// importation d'express
const express = require('express');
// importation du middleware/password
const password = require('../middleware/password');
// importation du middleware de controle de l'email
const email = require('../middleware/email');
// création du router
const router = express.Router();

const userCtrl = require('../controllers/users');

router.post('/signup', password, email, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;