import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Plus, Edit3, Trash2, Calendar, 
  Ticket, DollarSign, X, Loader2,
  CheckCircle, Eye, ArrowLeft, Trophy 
} from 'lucide-react';
import toast from 'react-hot-toast';

const RafflesManager = () => {
  // ==========================================
  // ESTADOS DEL COMPONENTE
  // ==========================================
  const [raffles, setRaffles] = useState([]); // Lista de todas las rifas
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [showModal, setShowModal] = useState(false); // Abrir/Cerrar formulario
  const [isEditing, setIsEditing] = useState(false); // ¿Es edición o creación?
  const [currentId, setCurrentId] = useState(null); // ID de la rifa que estamos editando
  
  // Estados para el Módulo de Inspección (Detalles de una rifa)
  const [inspectingRaffle, setInspectingRaffle] = useState(null); 
  const [raffleTickets, setRaffleTickets] = useState([]);

  // Datos del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticketPrice: '',
    totalTickets: '',
    drawDate: ''
  });

  // ==========================================
  // EFECTOS Y CARGA DE DATOS
  // ==========================================
  useEffect(() => {
    fetchRaffles();
  }, []);

  const fetchRaffles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/raffles');
      const data = Array.isArray(response.data) ? response.data : 
                   (response.data && Array.isArray(response.data.raffles)) ? response.data.raffles : [];
      setRaffles(data);
    } catch (error) {
      toast.error("Error al cargar las rifas");
      setRaffles([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LÓGICA DE INSPECCIÓN (VER DETALLES)
  // ==========================================
  const handleInspect = async (raffle) => {
    try {
      // Endpoint que trae todos los tickets de una rifa específica
      const { data } = await api.get(`/admin/tickets/raffle/${raffle._id}`);
      setRaffleTickets(data);
      setInspectingRaffle(raffle);
    } catch (error) {
      toast.error("Error al cargar boletos de esta rifa");
    }
  };

  const handlePickWinner = async (id) => {
    if (!window.confirm("¿Deseas sortear ahora mismo? Se elegirá un ganador entre los tickets PAGADOS.")) return;
    try {
      const { data } = await api.post(`/admin/raffles/${id}/pick-winner`);
      toast.success(`¡Ganador: ${data.winner.name} con el Ticket #${data.ticketNumber}!`);
      setInspectingRaffle(null); // Volver a la lista
      fetchRaffles(); // Refrescar datos
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al realizar el sorteo");
    }
  };

  // ==========================================
  // CRUD BÁSICO (CREAR, EDITAR, ELIMINAR)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/admin/raffles/${currentId}`, formData);
        toast.success("Rifa actualizada");
      } else {
        await api.post('/admin/raffles', formData);
        toast.success("Rifa creada");
      }
      closeModal();
      fetchRaffles();
    } catch (error) {
      toast.error("Error en la operación");
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
    if (!window.confirm("¿Eliminar rifa definitivamente?")) return;
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
    setFormData({ title: '', description: '', ticketPrice: '', totalTickets: '', drawDate: '' });
  };

  // Pantalla de carga
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  // ==============================================================================
  // RENDERIZADO: VISTA 1 - INSPECTOR DE DETALLES
  // ==============================================================================
  if (inspectingRaffle) {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        {/* Botón de regreso */}
        <button onClick={() => setInspectingRaffle(null)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold mb-4">
          <ArrowLeft size={18} /> Volver a la lista
        </button>

        {/* Tarjeta de información principal de la rifa */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900">{inspectingRaffle.title}</h2>
              <p className="text-slate-400 font-medium mt-2">{inspectingRaffle.description}</p>
            </div>
            {inspectingRaffle.status !== 'closed' && (
               <button 
                onClick={() => handlePickWinner(inspectingRaffle._id)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-amber-100 transition-all"
               >
                <Trophy size={20} /> Sortear Ganador
               </button>
            )}
          </div>

          {/* Grilla de todos los tickets comprados/apartados */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {raffleTickets.length > 0 ? raffleTickets.map(t => (
              <div key={t._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Boleto</p>
                <p className="text-xl font-black text-slate-900">#{t.number}</p>
                <p className="text-[10px] font-bold text-blue-600 truncate">{t.user?.name || 'Anonimo'}</p>
                <div className={`mt-2 h-1.5 w-full rounded-full ${t.status === 'paid' ? 'bg-green-500' : 'bg-amber-400'}`}></div>
              </div>
            )) : (
              <p className="col-span-full py-10 text-center text-slate-400 font-bold italic">No hay boletos comprados aún.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================================
  // RENDERIZADO: VISTA 2 - LISTA PRINCIPAL (TABLA)
  // ==============================================================================
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* SECCIÓN: CABECERA Y BOTÓN NUEVO */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic">Gestión de Rifas</h2>
          <p className="text-slate-400 font-bold text-sm tracking-tight">Crea, edita o monitorea tus sorteos activos.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-blue-100 transition-all">
          <Plus size={20} strokeWidth={3} /> Nueva Rifa
        </button>
      </div>

      {/* SECCIÓN: TABLA DE DATOS */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Información de Rifa</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Capacidad</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Precio</th>
              <th className="p-6 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {Array.isArray(raffles) && raffles.length > 0 ? raffles.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50/30 transition-colors group">
                {/* Info y Fecha */}
                <td className="p-6">
                  <p className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{r.title}</p>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mt-1 uppercase tracking-tighter">
                    <Calendar size={12} /> {r.drawDate ? new Date(r.drawDate).toLocaleDateString('es-VE') : 'Sin fecha'}
                  </div>
                </td>
                {/* Tickets Totales */}
                <td className="p-6">
                  <div className="flex items-center gap-2 font-bold text-slate-500">
                    <Ticket size={16} className="text-slate-300" /> {r.totalTickets} boletos
                  </div>
                </td>
                {/* Precio */}
                <td className="p-6 font-black text-2xl text-blue-600">${r.ticketPrice}</td>
                {/* Botones de acción */}
                <td className="p-6">
                  <div className="flex justify-center gap-2">
                    {/* BOTÓN: INSPECCIONAR (OJO) */}
                    <button onClick={() => handleInspect(r)} className="p-3 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all" title="Ver Boletos">
                      <Eye size={20} />
                    </button>
                    {/* BOTÓN: EDITAR (LÁPIZ) */}
                    <button onClick={() => handleEdit(r)} className="p-3 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-2xl transition-all">
                      <Edit3 size={20} />
                    </button>
                    {/* BOTÓN: ELIMINAR (BOTE) */}
                    <button onClick={() => handleDelete(r._id)} className="p-3 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="p-20 text-center text-slate-300 font-black uppercase tracking-widest italic opacity-50">No hay rifas para mostrar</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==============================================================================
          MODAL: FORMULARIO DE CREACIÓN / EDICIÓN
          ============================================================================== */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            {/* Cerrar modal */}
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={28} /></button>
            
            <h2 className="text-3xl font-black mb-8 tracking-tight uppercase italic">{isEditing ? 'Editar Datos' : 'Nueva Rifa'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nombre del Sorteo</label>
                <input type="text" required className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none font-bold" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>

              {/* Precio y Cantidad */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Precio Unitario ($)</label>
                  <input type="number" required className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none font-black text-blue-600" value={formData.ticketPrice} onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Total Boletos</label>
                  <input type="number" required className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none font-bold" value={formData.totalTickets} onChange={(e) => setFormData({...formData, totalTickets: e.target.value})} />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descripción / Reglas</label>
                <textarea rows="3" className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none font-medium text-slate-500 resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              {/* Fecha */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Fecha del Sorteo</label>
                <input type="date" required className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none font-bold" value={formData.drawDate} onChange={(e) => setFormData({...formData, drawDate: e.target.value})} />
              </div>

              {/* Botón enviar */}
              <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all pt-4">
                {isEditing ? 'Guardar Cambios' : 'Lanzar Rifa'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RafflesManager;