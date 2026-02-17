const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Registrar usuario
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create({ name, email, password, phone });

    // Si llegamos aquí, el registro fue exitoso
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    // ESTA ES LA LÍNEA 31 FAMOSA
    console.log("--- DEBUG REGISTRO ---");
    console.error("Mensaje de error:", error.message);
    console.error(error.stack);
    
    // IMPORTANTE: Aquí NO debe decir next(error)
    return res.status(500).json({ 
      message: 'Error en el servidor', 
      detail: error.message 
    });
  }
};

// @desc    Login usuario
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error("Error en login:", error.message);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};