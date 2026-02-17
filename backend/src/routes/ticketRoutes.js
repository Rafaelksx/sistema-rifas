const express = require('express');
const router = express.Router();
const { buyTicket, getMyTickets } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

// Solo usuarios logueados pueden comprar
router.post('/buy', protect, buyTicket);
router.get('/my-tickets', protect, getMyTickets);

module.exports = router;