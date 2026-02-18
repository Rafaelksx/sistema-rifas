import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Ticket, CreditCard, Image as ImageIcon, Send, Loader2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const VENEZUELA_BANKS = [
  { id: '0102', name: 'Banco de Venezuela' },
  { id: '0105', name: 'Mercantil' },
  { id: '0108', name: 'Provincial' },
  { id: '0114', name: 'Bancaribe' },
  { id: '0115', name: 'Exterior' },
  { id: '0128', name: 'Caroní' },
  { id: '0134', name: 'Banesco' },
  { id: '0151', name: 'BFC - Fondo Común' },
  { id: '0163', name: 'Tesoro' },
  { id: '0166', name: 'Agrícola' },
  { id: '0171', name: 'Bancamiga' },
  { id: '0172', name: 'Bancamiga' },
  { id: '0174', name: 'Banplus' },
  { id: '0175', name: 'Bicentenario' },
  { id: '0177', name: 'BANFANB' },
  { id: '0191', name: 'BNC - Nacional de Crédito' },
];

const MyTickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // Estados del Formulario
  const [referenceNumber, setReferenceNumber] = useState('');
  const [bankOrigin, setBankOrigin] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchMyTickets(); }, []);

  const fetchMyTickets = async () => {
    try {
      const { data } = await api.get('/users/my-tickets'); 
      setTickets(data);
    } catch (error) { toast.error("Error al cargar tus boletos"); }
    finally { setLoading(false); }
  };

  const handleReportPayment = async (e) => {
    e.preventDefault();
    if (!bankOrigin) return toast.error("Selecciona un banco");
    setUploading(true);

    try {
      // Nota: Aquí deberías subir la imagen a Cloudinary primero.
      // Usaremos una URL de prueba por ahora.
      const evidenceUrl = "https://via.placeholder.com/150";

      await api.post('/payments/report', {
        raffleId: selectedGroup.raffle._id,
        referenceNumber,
        bankOrigin,
        amount,
        evidenceUrl
      });

      toast.success("Pago enviado correctamente");
      setSelectedGroup(null);
      fetchMyTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al reportar");
    } finally { setUploading(false); }
  };

  const groupedTickets = tickets.reduce((groups, t) => {
    const raffleId = t.raffle?._id;
    if (!raffleId) return groups;
    if (!groups[raffleId]) {
      groups[raffleId] = { raffle: t.raffle, numbers: [], status: t.status, totalPrice: 0 };
    }
    groups[raffleId].numbers.push(t.number);
    groups[raffleId].totalPrice += t.raffle.ticketPrice || 0;
    return groups;
  }, {});

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-black">Mis Boletos</h1>
        {Object.values(groupedTickets).map((group) => (
          <div key={group.raffle._id} className="bg-white p-6 rounded-3xl border shadow-sm">
            <h4 className="font-bold text-xl">{group.raffle.title}</h4>
            <div className="flex flex-wrap gap-2 my-4">
              {group.numbers.map(n => <span key={n} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">#{n}</span>)}
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <p className="font-black text-2xl text-blue-600">${group.totalPrice}</p>
              {group.status === 'reserved' && (
                <button onClick={() => { setSelectedGroup(group); setAmount(group.totalPrice); }} className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold">Reportar Pago</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        {selectedGroup && (
          <form onSubmit={handleReportPayment} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border space-y-4">
            <h3 className="text-xl font-black">Confirmar Pago</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400">Banco de Origen</label>
              <select 
                required 
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-blue-500 font-medium"
                value={bankOrigin}
                onChange={(e) => setBankOrigin(e.target.value)}
              >
                <option value="">Selecciona un banco</option>
                {VENEZUELA_BANKS.map(bank => (
                  <option key={bank.id} value={bank.name}>{bank.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400">Referencia (Últimos 4-8 dígitos)</label>
              <input 
                type="text" required 
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-blue-500"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400">Monto ($)</label>
              <input 
                type="number" disabled 
                className="w-full p-3 bg-gray-100 border rounded-xl font-bold"
                value={amount}
              />
            </div>

            <button disabled={uploading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2">
              {uploading ? <Loader2 className="animate-spin" /> : <>Enviar Reporte <ChevronRight size={18} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyTickets;