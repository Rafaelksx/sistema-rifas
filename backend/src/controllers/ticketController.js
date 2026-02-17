const Ticket = require('../models/Ticket');
const Raffle = require('../models/Raffle');

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

exports.buyTicket = async (req, res) => {
  try {
    const { raffleId, number } = req.body;

    // 1. Verificar si la rifa existe y está activa
    const raffle = await Raffle.findById(raffleId);
    if (!raffle || raffle.status !== 'active') {
      return res.status(404).json({ message: 'Rifa no disponible' });
    }

    // 2. Verificar si el número ya está ocupado
    const existingTicket = await Ticket.findOne({ raffle: raffleId, number: number });
    if (existingTicket) {
      return res.status(400).json({ message: 'Este número ya fue vendido o apartado' });
    }

    // 3. Crear el ticket (req.user._id viene del middleware protect)
    const ticket = await Ticket.create({
      user: req.user._id,
      raffle: raffleId,
      number: number,
      status: 'pending' // Esperando validación de Pago Móvil
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error al comprar ticket:", error.message);
    res.status(500).json({ message: 'Error al procesar la compra' });
  }
};

// backend/src/controllers/ticketController.js

exports.getMyTickets = async (req, res) => {
  try {
    // Buscamos tickets del usuario (req.user._id viene de protect)
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('raffle', 'title ticketPrice image') // Traemos info de la rifa
      .sort({ createdAt: -1 });
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tus boletos' });
  }
};