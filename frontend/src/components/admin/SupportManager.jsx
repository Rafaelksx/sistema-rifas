import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  LifeBuoy, MessageSquare, CheckCircle, 
  Clock, AlertCircle, Send, X, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

const SupportManager = () => {
  // 1. PROTECCIÓN: Inicializamos siempre como un array vacío
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/support/all');
      
      // 2. PROTECCIÓN: Validamos que la data sea un array
      // Si el backend envía { tickets: [...] }, extraemos el array. Si no, devolvemos []
      const data = Array.isArray(response.data) ? response.data : 
                   (response.data && Array.isArray(response.data.tickets)) ? response.data.tickets : [];
      
      setTickets(data);
    } catch (error) {
      console.error("Error al cargar soporte:", error);
      toast.error("No se pudieron cargar los tickets de soporte");
      setTickets([]); // Mantenemos el array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    if (!adminResponse.trim()) return toast.error("Escribe una respuesta");

    setIsSubmitting(true);
    try {
      await api.put(`/support/${selectedTicket._id}/resolve`, {
        adminResponse,
        status: 'resolved'
      });
      toast.success("Ticket resuelto");
      setAdminResponse('');
      setSelectedTicket(null);
      fetchTickets();
    } catch (error) {
      toast.error("Error al cerrar el ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-3xl font-black mb-6 italic text-slate-900 uppercase">Soporte Técnico</h2>
        
        {/* 3. PROTECCIÓN FINAL: Verificamos si tickets es un array antes de mapear */}
        {Array.isArray(tickets) && tickets.length > 0 ? (
          tickets.map((t) => (
            <div 
              key={t._id} 
              onClick={() => setSelectedTicket(t)}
              className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer bg-white flex items-center justify-between ${
                selectedTicket?._id === t._id ? 'border-blue-600 shadow-xl shadow-blue-50' : 'border-transparent hover:border-slate-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.status === 'open' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 uppercase text-xs tracking-wider">
                    {t.issueType?.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-slate-500">{t.user?.name || 'Usuario'}</p>
                </div>
              </div>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${t.status === 'open' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {t.status}
              </span>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
            <LifeBuoy size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">No hay casos de soporte abiertos.</p>
          </div>
        )}
      </div>

      {/* DETALLE Y RESPUESTA */}
      <div className="lg:col-span-1">
        {selectedTicket ? (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl sticky top-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl">Detalle</h3>
              <button onClick={() => setSelectedTicket(null)}><X size={20}/></button>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-tighter">Problema</p>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">{selectedTicket.message}</p>
              </div>
              <form onSubmit={handleResolve} className="space-y-4">
                <textarea 
                  required
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-medium text-sm"
                  rows="4"
                  placeholder="Respuesta oficial..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                />
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin"/> : <Send size={18}/>} Resolver
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="h-full bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex items-center justify-center p-10 text-center">
            <p className="text-slate-400 font-bold">Selecciona un caso para responder.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportManager;