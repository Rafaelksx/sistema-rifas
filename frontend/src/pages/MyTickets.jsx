import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Ticket, CreditCard, Image as ImageIcon, Send, Clock, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyTickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario de pago
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      const { data } = await api.get('/users/my-tickets'); // Necesitarás crear este endpoint en el backend
      setTickets(data);
    } catch (error) {
      toast.error("Error al cargar tus boletos");
    } finally {
      setLoading(false);
    }
  };

  const handleReportPayment = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Debes subir la captura del pago");
    
    setUploading(true);
    try {
      // 1. Simulación de subida a Cloudinary (aquí iría tu lógica de upload)
      const evidenceUrl = "https://res.cloudinary.com/demo/image/upload/v123456/sample_receipt.jpg";

      // 2. Enviar datos al backend
      await api.post('/payments/report', {
        ticketId: selectedTicket._id,
        reference,
        amount,
        evidenceUrl
      });

      toast.success("Pago reportado con éxito. En espera de verificación.");
      setSelectedTicket(null);
      fetchMyTickets(); // Recargar lista
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al reportar");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-black text-gray-900">Mis Boletos</h1>
        <p className="text-gray-500">Gestiona tus reservas y reporta tus pagos aquí.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LISTA DE BOLETOS */}
        <div className="lg:col-span-2 space-y-4">
          {tickets.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl text-center border-2 border-dashed border-gray-100">
              <Ticket className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Aún no tienes boletos reservados.</p>
            </div>
          ) : (
            tickets.map((t) => (
              <div key={t._id} className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-4 transition-all ${t.status === 'reserved' ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${t.status === 'reserved' ? 'bg-yellow-500' : t.status === 'verifying' ? 'bg-blue-500' : 'bg-green-600'}`}>
                    {t.number}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.raffle?.title}</h4>
                    <p className="text-sm text-gray-500 capitalize">Estado: {t.status}</p>
                  </div>
                </div>

                {t.status === 'reserved' && (
                  <button 
                    onClick={() => setSelectedTicket(t)}
                    className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition flex items-center gap-2"
                  >
                    <CreditCard size={18} /> Reportar Pago
                  </button>
                )}
                {t.status === 'verifying' && (
                  <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                    <Clock size={18} className="animate-pulse" /> Verificando...
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* FORMULARIO DE REPORTE (Aparece cuando seleccionas un ticket) */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 sticky top-24">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Send className="text-blue-600" /> Pagar Boleto #{selectedTicket.number}
              </h3>
              
              <form onSubmit={handleReportPayment} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 ml-1">Referencia (Últimos 6 u 8 dígitos)</label>
                  <input 
                    type="text" required
                    className="w-full mt-1 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={reference} onChange={(e) => setReference(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 ml-1">Monto Pagado ($ o Bs)</label>
                  <input 
                    type="number" required
                    className="w-full mt-1 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={amount} onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 ml-1">Captura del Comprobante</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition cursor-pointer relative">
                    <input 
                      type="file" accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <div className="space-y-1 text-center">
                      <ImageIcon className="mx-auto text-gray-400" />
                      <p className="text-xs text-gray-500">{image ? image.name : "Subir imagen"}</p>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={uploading}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="animate-spin" /> : "Enviar Reporte"}
                </button>
                <button 
                  type="button" onClick={() => setSelectedTicket(null)}
                  className="w-full text-gray-400 text-sm font-medium hover:text-gray-600"
                >
                  Cancelar
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 text-center">
              <AlertCircle className="mx-auto text-blue-400 mb-4" />
              <p className="text-blue-800 font-medium">Selecciona un boleto reservado para reportar el pago.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;