// backend/src/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');    // Si usas hashing aquí

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación manual rápida para descartar undefined
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const user = await User.create({ name, email, password });

    // VERIFICACIÓN DEL TOKEN
    if (!process.env.JWT_SECRET) {
      console.error("❌ ERROR: JWT_SECRET no está definido en el archivo .env");
      return res.status(500).json({ message: "Error de configuración en el servidor" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token
    });

  } catch (error) {
    console.error("Detalle del error:", error);
    res.status(500).json({ message: error.message });
  }
};