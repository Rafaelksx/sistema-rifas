const SupportTicket = require('../models/SupportTicket');

exports.createTicket = async (req, res) => {
  try {
    const { paymentId, issueType, message } = req.body;
    const ticket = await SupportTicket.create({
      user: req.user._id,
      payment: paymentId,
      issueType,
      message
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin responde y cierra el ticket
exports.resolveTicket = async (req, res) => {
  try {
    const { adminResponse, status } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id, 
      { adminResponse, status }, 
      { new: true }
    );
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener tickets del usuario logueado
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener todos los tickets (Admin con paginación)
exports.getAllTickets = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const status = req.query.status; // 'open' o 'resolved'

    const filter = status ? { status } : {};
    const count = await SupportTicket.countDocuments(filter);
    const tickets = await SupportTicket.find(filter)
      .populate('user', 'name email phone')
      .populate('payment', 'reference')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ tickets, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};