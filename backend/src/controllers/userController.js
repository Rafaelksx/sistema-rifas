// backend/src/controllers/userController.js
// Este archivo contiene controladores orientados a usuario (no autenticación).
// La creación/registro y login se manejan en `authController.js`.

const User = require('../models/User');

// Placeholder: aquí puedes añadir controladores como getUserProfile, updateUser, etc.
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};