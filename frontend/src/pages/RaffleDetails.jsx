import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Info, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RaffleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [raffle, setRaffle] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const raffleRes = await api.get(`/raffles/${id}`); // Necesitarás este endpoint en el backend si no lo hicimos
        const ticketsRes = await api.get(`/tickets/raffle/${id}`);
        setRaffle(raffleRes.data);
        setTickets(ticketsRes.data);
      } catch (error) {
        toast.error("Error al cargar los detalles");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleReserve = async (ticketId, ticketNumber) => {
    if (!user) {
      toast.error("Debes iniciar sesión para reservar");
      return navigate('/login');
    }

    setProcessing(true);
    try {
      await api.put(`/tickets/reserve/${ticketId}`);
      toast.success(`¡Número ${ticketNumber} reservado!`);
      // Recargar tickets para ver el cambio de estado
      const { data } = await api.get(`/tickets/raffle/${id}`);
      setTickets(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al reservar");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER DE LA RIFA */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{raffle?.title}</h1>
          <p className="text-gray-500">{raffle?.description}</p>
        </div>
        <div className="text-center bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-sm text-blue-600 font-bold uppercase tracking-wider">Precio por boleto</p>
          <p className="text-4xl font-black text-blue-700">${raffle?.price}</p>
        </div>
      </div>

      {/* LEYENDA DE COLORES */}
      <div className="flex flex-wrap gap-4 justify-center bg-gray-100 p-4 rounded-2xl text-sm font-medium">
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-500 rounded-full"></span> Disponible</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-400 rounded-full"></span> Reservado</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-500 rounded-full"></span> Verificando</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-gray-300 rounded-full"></span> Vendido</div>
      </div>

      {/* GRID DE TICKETS */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
        {tickets.map((ticket) => (
          <button
            key={ticket._id}
            disabled={ticket.status !== 'available' || processing}
            onClick={() => handleReserve(ticket._id, ticket.number)}
            className={`
              aspect-square flex items-center justify-center rounded-xl font-bold text-sm transition-all transform active:scale-95
              ${ticket.status === 'available' ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-100' : ''}
              ${ticket.status === 'reserved' ? 'bg-yellow-400 text-white cursor-not-allowed opacity-80' : ''}
              ${ticket.status === 'verifying' ? 'bg-blue-500 text-white cursor-not-allowed opacity-80' : ''}
              ${ticket.status === 'paid' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
            `}
          >
            {ticket.number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RaffleDetails;