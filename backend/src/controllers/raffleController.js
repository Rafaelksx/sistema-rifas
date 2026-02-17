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

exports.getRaffleStats = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      { $match: { raffle: new mongoose.Types.ObjectId(req.params.id) } },
      { $group: {
          _id: "$status",
          count: { $sum: 1 }
      }}
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
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