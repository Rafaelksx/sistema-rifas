const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }, // Relación con el pago fallido
  issueType: { 
    type: String, 
    enum: ['wrong_reference', 'wrong_amount', 'other'], 
    required: true 
  },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved', 'closed'], default: 'open' },
  adminResponse: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);