// backend/src/config/cronService.js
const cron = require('node-cron');
const Ticket = require('../models/Ticket');

const initCron = () => {
  // Se ejecuta cada minuto: '* * * * *'
  cron.schedule('* * * * *', async () => {
    console.log('--- Ejecutando limpieza de reservas expiradas ---');
    
    try {
      // Definimos el tiempo límite (15 minutos atrás desde ahora)
      const tiempoLimite = new Date(Date.now() - 15 * 60 * 1000);

      /**
       * Caso de uso:
       * - Status debe ser 'reserved' (No tocamos 'verifying' ni 'paid')
       * - reservedAt debe ser menor al tiempo limite (más viejo que 15 min)
       */
      const result = await Ticket.updateMany(
        { 
          status: 'reserved', 
          reservedAt: { $lt: tiempoLimite } 
        },
        { 
          $set: { 
            status: 'available', 
            user: null, 
            reservedAt: null 
          } 
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Se liberaron ${result.modifiedCount} tickets por falta de pago.`);
      }
    } catch (error) {
      console.error('❌ Error en el Cron Job:', error.message);
    }
  });
};

module.exports = initCron;