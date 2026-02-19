// src/pages/admin/PaymentsManager.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Check, X, Eye, Loader2, AlertCircle, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentsManager = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // Cambiamos la ruta a la que sí existe en tu backend
      const { data } = await api.get('/admin/tickets');
      
      // Filtramos para mostrar solo los que necesitan verificación primero
      const ticketList = Array.isArray(data) ? data : [];
      setTickets(ticketList);
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudieron cargar los pagos");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, newStatus) => {
    try {
      // Usamos la ruta de confirmación que ya tienes
      await api.put(`/admin/tickets/confirm/${id}`, { status: newStatus });
      toast.success(newStatus === 'paid' ? "Pago aprobado" : "Pago rechazado");
      fetchTickets(); // Recargar lista
    } catch (error) {
      toast.error("Error al actualizar estado");
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-slate-900 uppercase italic">Verificación de Pagos</h2>
      
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Usuario / Rifa</th>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Referencia / Banco</th>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado</th>
              <th className="p-6 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tickets.filter(t => t.status === 'verifying').length > 0 ? (
              tickets.filter(t => t.status === 'verifying').map((t) => (
                <tr key={t._id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-slate-900">{t.user?.name || 'Usuario desconocido'}</p>
                    <p className="text-xs text-blue-600 font-bold">{t.raffle?.title}</p>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-slate-700">#{t.referenceNumber || 'S/N'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{t.bankOrigin || 'Transferencia'}</p>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase">
                      Por Verificar
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleVerify(t._id, 'paid')}
                        className="p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-100"
                        title="Aprobar Pago"
                      >
                        <Check size={18} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={() => handleVerify(t._id, 'available')}
                        className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-100"
                        title="Rechazar Pago"
                      >
                        <X size={18} strokeWidth={3} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <AlertCircle size={48} />
                    <p className="font-bold">No hay pagos pendientes de verificación.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsManager;