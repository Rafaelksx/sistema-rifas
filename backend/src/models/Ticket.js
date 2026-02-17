const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  number: { type: String, required: true }, // Usamos String por si quieres números como "001"
  raffle: { type: mongoose.Schema.Types.ObjectId, ref: 'Raffle', required: true },
  status: { 
    type: String, 
    enum: ['available', 'reserved', 'verifying', 'paid'], 
    default: 'available' 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reservedAt: { type: Date, default: null } // Fecha exacta de la reserva para el Cron Job
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);