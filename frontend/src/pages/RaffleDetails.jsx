import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RaffleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [raffle, setRaffle] = useState(null);
  const [occupiedNumbers, setOccupiedNumbers] = useState([]); // Ahora guardamos solo los ocupados
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Generamos el array de números basado en el total de la rifa
  const allNumbers = raffle 
    ? Array.from({ length: raffle.totalTickets }, (_, i) => i.toString().padStart(2, '0')) 
    : [];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [raffleRes, statsRes] = await Promise.all([
          api.get(`/raffles/${id}`),
          api.get(`/raffles/${id}/stats`) // El endpoint que hicimos para ver números ocupados
        ]);
        setRaffle(raffleRes.data);
        setOccupiedNumbers(statsRes.data.occupiedNumbers);
      } catch (error) {
        toast.error("Error al cargar los detalles");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleReserve = async (number) => {
    if (!user) {
      toast.error("Debes iniciar sesión para reservar");
      return navigate('/login');
    }

    setProcessing(true);
    try {
      // Ahora usamos POST para crear el ticket en lugar de PUT
      await api.post('/api/tickets/buy', {
        raffleId: id,
        number: number
      });
      
      toast.success(`¡Número ${number} apartado!`);
      
      // Actualizamos los números ocupados localmente
      setOccupiedNumbers([...occupiedNumbers, number]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al reservar");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* HEADER DE LA RIFA */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{raffle?.title}</h1>
          <p className="text-gray-500">{raffle?.description}</p>
        </div>
        <div className="text-center bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-sm text-blue-600 font-bold uppercase tracking-wider">Precio por boleto</p>
          <p className="text-4xl font-black text-blue-700">${raffle?.ticketPrice}</p>
        </div>
      </div>

      {/* LEYENDA */}
      <div className="flex flex-wrap gap-4 justify-center bg-gray-100 p-4 rounded-2xl text-sm font-medium">
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-500 rounded-full"></span> Disponible</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-gray-300 rounded-full"></span> Ocupado</div>
      </div>

      {/* GRID DE TICKETS DINÁMICO */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
        {allNumbers.map((num) => {
          const isOccupied = occupiedNumbers.includes(num);
          return (
            <button
              key={num}
              disabled={isOccupied || processing}
              onClick={() => handleReserve(num)}
              className={`
                aspect-square flex items-center justify-center rounded-xl font-bold text-sm transition-all transform active:scale-95
                ${!isOccupied ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-100' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RaffleDetails;