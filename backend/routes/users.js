// importation d'express
const express = require('express');
// importation du middleware/password
const password = require('../middleware/password');
// création du router
const router = express.Router();

const userCtrl = require('../controllers/users');

router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;