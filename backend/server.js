// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Cargar variables de entorno
dotenv.config();

const app = express();

// 1. Middlewares de Seguridad y Procesamiento
app.use(cors()); // Permite peticiones desde tu frontend (Vite)
app.use(express.json()); // Vital para leer el req.body
app.use(express.urlencoded({ extended: true }));

// 2. Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then((conn) => console.log(`✅ MongoDB Conectado: ${conn.connection.host}`))
  .catch((err) => {
    console.error(`❌ Error de conexión: ${err.message}`);
    process.exit(1);
  });

// 3. Importar Rutas
const userRoutes = require('./src/routes/userRoutes');
// const raffleRoutes = require('./src/routes/raffleRoutes'); // Descomenta cuando las tengas

// 4. Definir Rutas
app.use('/api/users', userRoutes);
// app.use('/api/raffles', raffleRoutes);

// Ruta de prueba inicial
app.get('/', (req, res) => {
  res.send('API de Sistema de Rifas corriendo...');
});

// 5. Manejo de Errores (¡ESTA ES LA PARTE CRÍTICA!)

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  const error = new Error(`No se encontró la ruta - ${req.originalUrl}`);
  res.status(404);
  next(error); // Aquí sí se usa next porque le pasamos el error al siguiente middleware
});

// Manejador de errores global
app.use((err, req, res, next) => {
  // Verificamos si ya se envió una respuesta al cliente para evitar el error ERR_HTTP_HEADERS_SENT
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`❌ Error detectado en el servidor: ${err.message}`);

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 6. Encender el Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});