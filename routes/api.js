const express = require('express');
const router = express.Router();
const penulisController = require('../controller/penulisController');
const komikController = require('../controller/komikController');
const genreController = require('../controller/genreController');
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

router.post("/register", penulisController.register);
router.post("/login", penulisController.login);


router.get("/genre", authMiddleware, genreController.getAll);
router.post("/genre", authMiddleware, genreController.create);
router.put("/genre/:id", authMiddleware, genreController.update);
router.delete("/genre/:id", authMiddleware, genreController.remove);

router.get("/komik", authMiddleware, komikController.getAll);
router.post("/komik", authMiddleware, uploadMiddleware.single("gambar"), komikController.create);
router.put("/komik/:id", authMiddleware, uploadMiddleware.single("gambar"), komikController.update);
router.delete("/komik/:id", authMiddleware, komikController.remove);

module.exports = router;