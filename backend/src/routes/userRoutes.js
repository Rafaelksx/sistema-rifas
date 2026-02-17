const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const Ticket = require('../models/Ticket');

// DEBUG: Esto te dirá en la terminal si las funciones se cargaron
console.log('Verificando funciones:', { 
  register: typeof registerUser, 
  login: typeof loginUser, 
  protect: typeof protect 
});

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/my-tickets', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('raffle', 'title price')
      .sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;