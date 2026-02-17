const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reference: { 
    type: String, 
    required: true, 
    unique: true // Evita que usen la misma referencia para dos tickets
  },
  evidenceUrl: { 
    type: String, 
    required: true // Hacemos la imagen obligatoria para mayor seguridad
  },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminNotes: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);