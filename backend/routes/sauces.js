const express = require("express");
// création du router
const router = express.Router();
// Importation du middleware d'authentification
const auth = require('../middleware/auth');
// Importation du middleware Multer
const multer = require('../middleware/multer-config');
// importation des controllers
const saucesCtrl = require('../controllers/sauces');

// Les routes
router.post("/", auth, multer, saucesCtrl.createSauce); 

router.put("/:id", auth, multer, saucesCtrl.modifySauce);

router.delete("/:id", auth, saucesCtrl.deleteSauce);

router.get("/:id", auth, saucesCtrl.getOneSauce);

router.get("/", auth, saucesCtrl.getAllSauces);

router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;