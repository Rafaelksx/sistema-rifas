const mongoose = require('mongoose');

const raffleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  totalNumbers: { type: Number, required: true }, // Ej: 100, 1000
  drawDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Raffle', raffleSchema);