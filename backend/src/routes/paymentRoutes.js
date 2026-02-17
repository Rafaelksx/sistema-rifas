// backend/src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { reportPayment, verifyPayment, getAllPayments } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Usuario reporta
router.post('/report', protect, reportPayment);

// Admin gestiona
router.get('/all', protect, admin, getAllPayments); // Para ver la lista en el Dashboard
router.put('/verify/:id', protect, admin, verifyPayment); // Aquí es donde pasan las notas

module.exports = router;