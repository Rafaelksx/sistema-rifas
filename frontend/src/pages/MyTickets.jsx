import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Ticket, CreditCard, Image as ImageIcon, Send, Clock, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const MyTickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario de pago (ahora basado en el grupo de la rifa)
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      // Usamos la ruta consolidada que ya definimos en el backend
      const { data } = await api.get('/users/my-tickets'); 
      setTickets(data);
    } catch (error) {
      toast.error("Error al cargar tus boletos");
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE AGRUPACIÓN ---
  const groupedTickets = tickets.reduce((groups, t) => {
    const raffleId = t.raffle?._id;
    if (!raffleId) return groups;

    if (!groups[raffleId]) {
      groups[raffleId] = {
        raffle: t.raffle,
        numbers: [],
        status: t.status, // Tomamos el estado del primer ticket del grupo
        totalPrice: 0,
        count: 0
      };
    }
    groups[raffleId].numbers.push(t.number);
    groups[raffleId].totalPrice += t.raffle.ticketPrice || 0;
    groups[raffleId].count += 1;
    return groups;
  }, {});

  const raffleGroups = Object.values(groupedTickets);

  const handleReportPayment = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Debes subir la captura del pago");
    
    setUploading(true);
    try {
      // 1. Simulación de subida (Sustituir por lógica de Cloudinary si la tienes)
      const evidenceUrl = "https://res.cloudinary.com/demo/image/upload/sample_receipt.jpg";

      // 2. Enviar datos al backend (Actualiza todos los tickets de esta rifa)
      await api.post('/payments/report', {
        raffleId: selectedGroup.raffle._id,
        reference,
        amount,
        evidenceUrl
      });

      toast.success("Pago reportado con éxito. Validaremos tus boletos pronto.");
      setSelectedGroup(null);
      setReference('');
      setAmount('');
      setImage(null);
      fetchMyTickets(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al reportar pago");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10">
      <header>
        <h1 className="text-4xl font-black text-gray-900">Mis Boletos</h1>
        <p className="text-gray-500 mt-2 text-lg">Gestiona tus participaciones y confirma tus pagos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LISTA DE RIFAS AGRUPADAS */}
        <div className="lg:col-span-2 space-y-6">
          {raffleGroups.length === 0 ? (
            <div className="bg-white p-16 rounded-[2rem] text-center border-2 border-dashed border-gray-100">
              <Ticket className="mx-auto text-gray-200 mb-4" size={64} />
              <p className="text-gray-400 font-medium text-xl">Aún no tienes boletos apartados.</p>
            </div>
          ) : (
            raffleGroups.map((group) => (
              <div key={group.raffle._id} className={`p-8 rounded-[2rem] border-2 transition-all bg-white ${group.status === 'reserved' ? 'border-yellow-100 shadow-xl shadow-yellow-50/50' : 'border-gray-50'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-black text-2xl text-gray-900">{group.raffle?.title}</h4>
                      <p className="text-gray-400 text-sm font-medium">{group.count} tickets seleccionados</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {group.numbers.sort().map((num) => (
                        <span key={num} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-sm shadow-md shadow-blue-100">
                          #{num}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-left md:text-right space-y-2 min-w-[120px]">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total a pagar</p>
                    <p className="text-4xl font-black text-blue-600">${group.totalPrice}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      group.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' : 
                      group.status === 'verifying' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {group.status === 'reserved' ? 'Pendiente de pago' : 
                       group.status === 'verifying' ? 'En verificación' : 'Pagado'}
                    </span>
                  </div>

                  {group.status === 'reserved' && (
                    <button 
                      onClick={() => setSelectedGroup(group)}
                      className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                    >
                      <CreditCard size={18} /> Reportar Pago Grupal
                    </button>
                  )}
                  
                  {group.status === 'verifying' && (
                    <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100">
                      <Clock size={18} className="animate-pulse" /> Estamos revisando tu pago
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* PANEL DE PAGO */}
        <div className="lg:col-span-1">
          {selectedGroup ? (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-blue-50 sticky top-24 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                <Send className="text-blue-600" /> Confirmar Pago
              </h3>
              <p className="text-gray-500 text-sm mb-8">Envía los detalles del Pago Móvil por tus {selectedGroup.count} números.</p>
              
              <form onSubmit={handleReportPayment} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Referencia Bancaria</label>
                  <input 
                    type="text" required placeholder="Ej: 12345678"
                    className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                    value={reference} onChange={(e) => setReference(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Monto exacto reportado</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                    <input 
                      type="number" required step="0.01"
                      className="w-full p-4 pl-8 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold"
                      value={amount} onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Captura de pantalla</label>
                  <div className="relative group">
                    <input 
                      type="file" accept="image/*" required
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <div className={`p-8 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center gap-2 ${image ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 group-hover:border-blue-300 group-hover:bg-gray-50'}`}>
                      <ImageIcon className={image ? 'text-blue-600' : 'text-gray-300'} size={32} />
                      <p className="text-xs text-gray-500 font-bold text-center">
                        {image ? image.name : "Seleccionar Comprobante"}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={uploading}
                  className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:bg-gray-200"
                >
                  {uploading ? <Loader2 className="animate-spin" /> : <>Validar Pago <ChevronRight size={20} /></>}
                </button>
                
                <button 
                  type="button" onClick={() => setSelectedGroup(null)}
                  className="w-full text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors"
                >
                  Cancelar operación
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-blue-50/50 p-10 rounded-[2.5rem] border-2 border-dashed border-blue-100 text-center space-y-4">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="text-blue-600" size={32} />
              </div>
              <p className="text-blue-900 font-bold leading-relaxed">
                Selecciona una de tus rifas pendientes para reportar el pago y asegurar tus números.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;