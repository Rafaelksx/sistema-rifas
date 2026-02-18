import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  LifeBuoy, MessageSquare, CheckCircle, 
  Clock, AlertCircle, Send, User, 
  ExternalLink, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

const SupportManager = () => {
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
      const { data } = await api.get('/support/all'); // Ruta admin definida en tus routes
      setTickets(data);
    } catch (error) {
      toast.error("Error al cargar los casos de soporte");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    if (!adminResponse.trim()) return toast.error("Escribe una respuesta para el usuario");

    setIsSubmitting(true);
    try {
      await api.put(`/support/${selectedTicket._id}/resolve`, {
        adminResponse,
        status: 'resolved'
      });
      toast.success("Ticket resuelto y notificado");
      setAdminResponse('');
      setSelectedTicket(null);
      fetchTickets();
    } catch (error) {
      toast.error("Error al cerrar el ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-red-100 text-red-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-slate-100 text-slate-700"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      
      {/* LISTADO DE TICKETS */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-3xl font-black mb-6">Casos de Soporte</h2>
        {tickets.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100">
            <LifeBuoy size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">No hay solicitudes pendientes.</p>
          </div>
        ) : (
          tickets.map((t) => (
            <div 
              key={t._id} 
              onClick={() => setSelectedTicket(t)}
              className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer bg-white flex items-center justify-between ${
                selectedTicket?._id === t._id ? 'border-blue-600 shadow-xl shadow-blue-50' : 'border-transparent hover:border-slate-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.status === 'open' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{t.issueType.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-xs text-slate-400 font-medium">De: {t.user?.name || 'Usuario desconocido'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(t.status)}
                <Clock size={16} className="text-slate-300" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* DETALLE Y RESPUESTA */}
      <div className="lg:col-span-1">
        {selectedTicket ? (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl sticky top-8 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-black text-xl">Detalle del Caso</h3>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-300 hover:text-slate-900"><X size={20}/></button>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Mensaje del Usuario</p>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">"{selectedTicket.message}"</p>
              </div>

              {selectedTicket.payment && (
                <div className="flex items-center justify-between p-4 border border-blue-50 rounded-2xl bg-blue-50/30">
                  <div className="flex items-center gap-2 text-blue-700">
                    <AlertCircle size={18} />
                    <p className="text-xs font-bold text-blue-700 uppercase">Pago Asociado</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 transition-all">
                    <ExternalLink size={18} />
                  </button>
                </div>
              )}

              {selectedTicket.status === 'resolved' ? (
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                  <p className="text-[10px] font-black uppercase text-green-600 mb-1">Tu Respuesta</p>
                  <p className="text-sm text-green-800 font-medium">{selectedTicket.adminResponse}</p>
                </div>
              ) : (
                <form onSubmit={handleResolve} className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Responder al Usuario</label>
                    <textarea 
                      required
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-medium text-sm text-slate-600"
                      rows="4"
                      placeholder="Ej: Hola, ya corregimos tu referencia. Puedes ver tu ticket pagado..."
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                    ></textarea>
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin"/> : <><Send size={18}/> Resolver Caso</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300">
              <LifeBuoy size={32} />
            </div>
            <p className="text-slate-400 font-bold max-w-[200px]">Selecciona un ticket para ver los detalles y responder.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportManager;