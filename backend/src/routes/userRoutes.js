const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Públicas
router.post('/register', registerUser);
router.post('/login', loginUser);

// Ejemplo de ruta privada para probar el token después
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;