// backend/src/models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  raffle: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Raffle', 
    required: true 
  },
  number: { type: String, required: true }, // El número elegido (ej: "05")
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  },
  paymentReference: { type: String }, // Para el Pago Móvil
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);