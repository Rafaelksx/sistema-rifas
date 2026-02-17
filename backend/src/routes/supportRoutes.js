// backend/src/routes/supportRoutes.js
const express = require('express');
const router = express.Router();
const { createTicket, resolveTicket, getUserTickets, getAllTickets } = require('../controllers/supportController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rutas para el usuario
router.post('/', protect, createTicket);          // Abrir reclamo
router.get('/my-tickets', protect, getUserTickets); // Ver mis reclamos

// Rutas para el administrador
router.get('/all', protect, admin, getAllTickets); // Ver todos los reclamos
router.put('/:id/resolve', protect, admin, resolveTicket); // Responder y cerrar

module.exports = router;