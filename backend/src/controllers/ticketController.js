const Ticket = require('../models/Ticket');

// @desc    Reservar un ticket
// @route   PUT /api/tickets/reserve/:id
exports.reserveTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const userId = req.user._id; // Viene del middleware de auth que haremos luego

    // Caso de uso: Solo reservar si está disponible
    const ticket = await Ticket.findOneAndUpdate(
      { _id: ticketId, status: 'available' }, 
      { 
        status: 'reserved', 
        user: userId, 
        reservedAt: Date.now() 
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(400).json({ message: "El ticket ya no está disponible o ya fue reservado" });
    }

    res.json({ message: "Ticket reservado, tienes 15 minutos para pagar", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener tickets de una rifa específica
exports.getTicketsByRaffle = async (req, res) => {
  try {
    const tickets = await Ticket.find({ raffle: req.params.raffleId });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Liberar un ticket manualmente (Fuerza Bruta)
// @route   PATCH /api/tickets/:id/release
exports.releaseTicketManual = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

    ticket.status = 'available';
    ticket.user = null;
    ticket.reservedAt = null;
    await ticket.save();

    res.json({ message: "Ticket liberado manualmente por el administrador", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};