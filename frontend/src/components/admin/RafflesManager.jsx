// src/pages/admin/RafflesManager.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Plus, Edit3, Trash2, Calendar, 
  Ticket, DollarSign, X, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

const RafflesManager = () => {
  // 1. PROTECCIÓN: Inicializamos siempre como array vacío para que .map() no falle al inicio
  const [raffles, setRaffles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticketPrice: '',
    totalTickets: '',
    drawDate: ''
  });

  useEffect(() => {
    fetchRaffles();
  }, []);

  const fetchRaffles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/raffles');
      
      // 2. PROTECCIÓN: Verificamos la estructura de la respuesta
      // Algunos backends devuelven el array directo, otros en response.data
      const data = Array.isArray(response.data) ? response.data : 
                   (response.data && Array.isArray(response.data.raffles)) ? response.data.raffles : [];
      
      setRaffles(data);
    } catch (error) {
      console.error("Error fetching raffles:", error);
      toast.error("Error al cargar las rifas");
      setRaffles([]); // Reset a array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/admin/raffles/${currentId}`, formData);
        toast.success("Rifa actualizada");
      } else {
        await api.post('/admin/raffles', formData);
        toast.success("Rifa creada exitosamente");
      }
      closeModal();
      fetchRaffles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error en la operación");
    }
  };

  const handleEdit = (raffle) => {
    setIsEditing(true);
    setCurrentId(raffle._id);
    setFormData({
      title: raffle.title,
      description: raffle.description,
      ticketPrice: raffle.ticketPrice,
      totalTickets: raffle.totalTickets,
      drawDate: raffle.drawDate ? raffle.drawDate.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar rifa? Esto borrará todos los tickets asociados.")) return;
    try {
      await api.delete(`/admin/raffles/${id}`);
      toast.success("Rifa eliminada");
      fetchRaffles();
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ title: '', description: '', ticketPrice: '', totalTickets: '', drawDate: '' });
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-20 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-slate-400 font-bold animate-pulse">Cargando rifas...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Rifas</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> Nueva Rifa
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Información</th>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Capacidad</th>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Precio</th>
              <th className="p-6 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {/* 3. PROTECCIÓN FINAL: Verificación antes de mapear */}
            {Array.isArray(raffles) && raffles.length > 0 ? (
              raffles.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-slate-900 text-lg">{r.title}</p>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mt-1">
                      <Calendar size={12} /> {r.drawDate ? new Date(r.drawDate).toLocaleDateString('es-VE') : 'Sin fecha'}
                    </div>
                  </td>
                  <td className="p-6 font-bold text-slate-600 italic">
                    {r.totalTickets} boletos
                  </td>
                  <td className="p-6 font-black text-2xl text-blue-600">${r.ticketPrice}</td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(r)} className="p-3 text-slate-400 hover:bg-slate-100 hover:text-blue-600 rounded-2xl transition-all">
                        <Edit3 size={20} />
                      </button>
                      <button onClick={() => handleDelete(r._id)} className="p-3 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <Ticket size={48} strokeWidth={1} />
                    <p className="font-bold">No hay rifas registradas aún.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (Se mantiene igual que el anterior...) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
              <X size={28} />
            </button>
            <h2 className="text-3xl font-black mb-8 tracking-tight">{isEditing ? 'Editar Rifa' : 'Lanzar Nueva Rifa'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Título</label>
                <input type="text" required className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none font-bold" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Precio ($)</label>
                  <input type="number" required className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none font-black text-blue-600" value={formData.ticketPrice} onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cant. Boletos</label>
                  <input type="number" required className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none font-bold" value={formData.totalTickets} onChange={(e) => setFormData({...formData, totalTickets: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                        Descripción 
                    </label>
                    <textarea 
                        rows="4" 
                        className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-medium text-slate-600 resize-none transition-all"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Fecha</label>
                <input type="date" required className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none font-bold" value={formData.drawDate} onChange={(e) => setFormData({...formData, drawDate: e.target.value})} />
              </div>
              <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all pt-4">
                {isEditing ? 'Guardar Cambios' : 'Publicar Ahora'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RafflesManager;