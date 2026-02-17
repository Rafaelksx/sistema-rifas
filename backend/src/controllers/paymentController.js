const Payment = require('../models/Payment');
const Ticket = require('../models/Ticket');

// @desc    Reportar un pago (Usuario)
// @route   POST /api/payments/report
exports.reportPayment = async (req, res) => {
  try {
    const { ticketId, reference, amount } = req.body;

    // 1. Verificar que el ticket esté reservado por ESTE usuario
    const ticket = await Ticket.findOne({ _id: ticketId, user: req.user._id, status: 'reserved' });
    if (!ticket) {
      return res.status(400).json({ message: "Ticket no encontrado o no está reservado por ti" });
    }

    // 2. Crear el registro de pago
    const payment = await Payment.create({
      ticket: ticketId,
      user: req.user._id,
      reference,
      amount
    });

    // 3. Cambiar estado del ticket a 'verifying' (Azul en el frontend)
    ticket.status = 'verifying';
    await ticket.save();

    res.status(201).json({ message: "Pago reportado. Esperando verificación administrativa.", payment });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: "Esta referencia ya fue utilizada." });
    res.status(500).json({ message: error.message });
  }
};

// @desc    Aprobar o Rechazar pago (Admin)
// @route   PUT /api/payments/verify/:id
exports.verifyPayment = async (req, res) => {
  try {
    const { status, adminNotes } = req.body; // 'approved' o 'rejected' y el comentario
    const payment = await Payment.findById(req.params.id).populate('ticket');

    if (!payment) return res.status(404).json({ message: "Pago no encontrado" });

    if (status === 'approved') {
      payment.status = 'approved';
      payment.ticket.status = 'paid';
    } else if (status === 'rejected') {
      payment.status = 'rejected';
      payment.ticket.status = 'available'; // Se libera
      payment.ticket.user = null;
      payment.ticket.reservedAt = null;
    }

    payment.adminNotes = adminNotes || ""; // Guardamos la nota del admin
    await payment.save();
    await payment.ticket.save();

    res.json({ message: `Pago ${status} con éxito`, payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const pageSize = 15;
    const page = Number(req.query.pageNumber) || 1;
    const status = req.query.status; // 'pending', 'approved', 'rejected'
    const search = req.query.search; // Para buscar por referencia

    let query = {};
    if (status) query.status = status;
    if (search) query.reference = { $regex: search, $options: 'i' };

    const count = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('user', 'name email phone')
      .populate('ticket', 'number')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ payments, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualización de reportPayment
exports.reportPayment = async (req, res) => {
  try {
    const { ticketId, reference, amount, evidenceUrl } = req.body;

    // Validación básica
    if (!evidenceUrl) {
      return res.status(400).json({ message: "Es obligatorio subir el comprobante de pago." });
    }

    const ticket = await Ticket.findOne({ _id: ticketId, user: req.user._id, status: 'reserved' });
    if (!ticket) return res.status(400).json({ message: "Ticket no disponible para reporte." });

    const payment = await Payment.create({
      ticket: ticketId,
      user: req.user._id,
      reference,
      amount,
      evidenceUrl // Guardamos la URL de la imagen
    });

    ticket.status = 'verifying';
    await ticket.save();

    res.status(201).json({ message: "Pago reportado con éxito", payment });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: "Referencia duplicada." });
    res.status(500).json({ message: error.message });
  }
};