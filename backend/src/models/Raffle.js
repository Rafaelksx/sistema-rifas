// backend/src/models/Raffle.js
const mongoose = require('mongoose');

const raffleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  totalTickets: { type: Number, required: true }, // Ej: 100
  image: { type: String }, // URL de Cloudinary o similar
  status: { 
    type: String, 
    enum: ['active', 'sold_out', 'finished', 'cancelled'], 
    default: 'active' 
  },
  drawDate: { type: Date, required: true },
  createdByName: { type: String } // Opcional: Nombre del admin que la creó
}, { timestamps: true });

module.exports = mongoose.model('Raffle', raffleSchema);