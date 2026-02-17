const express = require('express');
const router = express.Router();
const { createRaffle, getRaffles, deleteRaffle, getRaffleStats, getRaffleById } = require('../controllers/raffleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, createRaffle)
  .get(getRaffles);

router.route('/:id')
  .delete(protect, admin, deleteRaffle);

router.get('/:id/stats', protect, admin, getRaffleStats);
router.get('/:id', getRaffleById);

module.exports = router;