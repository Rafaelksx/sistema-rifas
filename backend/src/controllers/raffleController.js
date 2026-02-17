const Raffle = require('../models/Raffle');
const Ticket = require('../models/Ticket');

// @desc    Crear nueva rifa y generar sus tickets
// @route   POST /api/raffles
exports.createRaffle = async (req, res) => {
  try {
    const { title, description, price, totalNumbers, drawDate } = req.body;

    const raffle = await Raffle.create({
      title, description, price, totalNumbers, drawDate
    });

    // Generar tickets automáticamente
    const tickets = [];
    for (let i = 0; i < totalNumbers; i++) {
      // Formatear número (ej: 00, 01, 02...) según el total
      const formattedNumber = i.toString().padStart(totalNumbers.toString().length, '0');
      tickets.push({
        number: formattedNumber,
        raffle: raffle._id
      });
    }

    await Ticket.insertMany(tickets);

    res.status(201).json({ message: "Rifa y tickets creados con éxito", raffle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener todas las rifas
exports.getRaffles = async (req, res) => {
  try {
    // 1. Extraer parámetros de la URL con valores por defecto
    const pageSize = 10; // Cantidad de rifas por página
    const page = Number(req.query.pageNumber) || 1;
    const status = req.query.status; // 'active', 'completed', etc.

    // 2. Construir el filtro
    const filter = status ? { status } : {};

    // 3. Obtener el conteo total para la paginación en el Front
    const count = await Raffle.countDocuments(filter);

    // 4. Buscar con límite y salto (skip)
    const raffles = await Raffle.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 }); // Las más nuevas primero

    res.json({
      raffles,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener una rifa por ID
// @route   GET /api/raffles/:id
exports.getRaffleById = async (req, res) => {
  try {
    const raffle = await Raffle.findById(req.params.id);
    if (raffle) {
      res.json(raffle);
    } else {
      res.status(404).json({ message: 'Rifa no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la rifa' });
  }
};

// @desc    Eliminar una rifa y todos sus tickets asociados
// @route   DELETE /api/raffles/:id
exports.deleteRaffle = async (req, res) => {
  try {
    const raffle = await Raffle.findById(req.params.id);
    if (!raffle) return res.status(404).json({ message: "Rifa no encontrada" });

    // Borramos la rifa y todos los tickets que le pertenecen
    await Ticket.deleteMany({ raffle: raffle._id });
    await raffle.deleteOne();

    res.json({ message: "Rifa y sus tickets eliminados permanentemente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar datos de la rifa (Título, descripción, fecha)
// @route   PUT /api/raffles/:id
exports.updateRaffle = async (req, res) => {
  try {
    const raffle = await Raffle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Rifa actualizada", raffle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Finalizar rifa manualmente (Cerrar ventas)
// @route   PATCH /api/raffles/:id/finish
exports.finishRaffle = async (req, res) => {
  try {
    const raffle = await Raffle.findById(req.params.id);
    if (!raffle) return res.status(404).json({ message: "Rifa no encontrada" });

    raffle.status = 'completed'; // Cambiamos a completada
    await raffle.save();

    // Opcional: Liberar todos los tickets que quedaron 'reserved' pero no pagados al cerrar
    await Ticket.updateMany(
      { raffle: raffle._id, status: 'reserved' },
      { status: 'available', user: null, reservedAt: null }
    );

    res.json({ message: "Rifa finalizada. No se aceptan más reservas.", raffle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear rifas iniciales de prueba
exports.seedRaffles = async (req, res) => {
  try {
    await Raffle.deleteMany(); // Limpiamos para no duplicar

    const sampleRaffles = [
      {
        title: "Súper Rifa iPhone 15 Pro",
        description: "Participa por un iPhone 15 Pro de 128GB. Sorteo por lotería del Táchira.",
        ticketPrice: 5,
        totalTickets: 100,
        image: "https://via.placeholder.com/400x250?text=iPhone+15",
        drawDate: new Date("2026-03-30"),
        status: "active"
      },
      {
        title: "Moto Bera SBR 2024",
        description: "Llévate una moto 0km. El precio incluye placa y casco.",
        ticketPrice: 10,
        totalTickets: 500,
        image: "https://via.placeholder.com/400x250?text=Moto+Bera",
        drawDate: new Date("2026-04-15"),
        status: "active"
      }
    ];

    await Raffle.insertMany(sampleRaffles);
    res.json({ message: "¡Rifas de prueba creadas exitosamente!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// backend/src/controllers/raffleController.js

exports.getRaffleStats = async (req, res) => {
  try {
    const raffleId = req.params.id;
    
    // Buscamos todos los tickets de esta rifa
    const tickets = await Ticket.find({ raffle: raffleId }).select('number status');
    
    // Creamos un array solo con los números ocupados para facilitar al frontend
    const occupiedNumbers = tickets.map(t => t.number);
    
    res.json({
      occupiedNumbers, // Ej: ["05", "22", "48"]
      totalSold: tickets.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};