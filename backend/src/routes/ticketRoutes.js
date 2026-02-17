const express = require('express');
const router = express.Router();
const { reserveTicket, getTicketsByRaffle, releaseTicketManual } = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/raffle/:raffleId', getTicketsByRaffle);
router.put('/reserve/:id', protect, reserveTicket); // Cualquier usuario logueado reserva
router.patch('/:id/release', protect, admin, releaseTicketManual);

module.exports = router;