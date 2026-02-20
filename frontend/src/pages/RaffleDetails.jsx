import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Ticket, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const RaffleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [raffle, setRaffle] = useState(null);
  // PROTECCIÓN: Inicializamos siempre como arrays vacíos
  const [occupiedNumbers, setOccupiedNumbers] = useState([]);
  const [mySelectedNumbers, setMySelectedNumbers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Generamos el array de números de forma segura
  const allNumbers = raffle 
    ? Array.from({ length: raffle.totalTickets || 100 }, (_, i) => i.toString().padStart(2, '0')) 
    : [];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [raffleRes, statsRes] = await Promise.all([
          api.get(`/raffles/${id}`),
          api.get(`/raffles/${id}/stats`)
        ]);

        setRaffle(raffleRes.data);
        // Validamos que statsRes.data.occupiedNumbers sea un array antes de setear
        setOccupiedNumbers(Array.isArray(statsRes.data?.occupiedNumbers) ? statsRes.data.occupiedNumbers : []);
        
        // Opcional: Si el backend devuelve tus números comprados en una propiedad aparte
        if (Array.isArray(statsRes.data?.myNumbers)) {
          setMySelectedNumbers(statsRes.data.myNumbers);
        }
      } catch (error) {
        console.error("Error cargando detalles:", error);
        toast.error("Error al cargar los detalles de la rifa");
        // En caso de error, aseguramos que sigan siendo arrays para evitar el crash del render
        setOccupiedNumbers([]);
        setMySelectedNumbers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleToggleTicket = async (number) => {
    if (!user) {
      toast.error("Debes iniciar sesión para participar");
      return navigate('/login');
    }

    // Uso de encadenamiento opcional para evitar el TypeError
    const isMine = mySelectedNumbers?.includes(number);
    setProcessing(true);

    try {
      if (isMine) {
        // DESELECCIONAR
        await api.delete(`/tickets/${id}/${number}`); 
        setMySelectedNumbers(prev => prev.filter(n => n !== number));
        setOccupiedNumbers(prev => prev.filter(n => n !== number));
        toast.success(`Número ${number} liberado`);
      } else {
        // SELECCIONAR
        await api.post('/tickets/buy', { raffleId: id, number: number });
        setMySelectedNumbers(prev => [...prev, number]);
        setOccupiedNumbers(prev => [...prev, number]);
        toast.success(`Número ${number} reservado`);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error al procesar la solicitud";
      toast.error(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-gray-500 font-medium">Cargando tablero de números...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 pb-24">
      {/* HEADER DE LA RIFA */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 leading-tight">{raffle?.title}</h1>
          <p className="text-gray-500 max-w-md">{raffle?.description}</p>
        </div>
        <div className="text-center bg-blue-50 p-6 rounded-2xl border border-blue-100 min-w-[150px]">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">Costo por ticket</p>
          <p className="text-4xl font-black text-blue-700">${raffle?.ticketPrice}</p>
        </div>
      </div>

      {/* LEYENDA */}
      <div className="flex flex-wrap gap-6 justify-center bg-white p-6 rounded-2xl shadow-sm border border-gray-50 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-green-500 rounded-lg shadow-sm"></span> 
          <span className="text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-blue-600 rounded-lg shadow-sm ring-2 ring-blue-100"></span> 
          <span className="text-gray-600">Tu Selección</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-gray-200 rounded-lg"></span> 
          <span className="text-gray-400">Ocupado</span>
        </div>
      </div>

      {/* GRID DE TICKETS - Aquí es donde fallaba antes */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-3">
        {allNumbers.map((num) => {
          // Usamos encadenamiento opcional ?. por seguridad máxima
          const isOccupied = occupiedNumbers?.includes(num);
          const isMine = mySelectedNumbers?.includes(num);

          return (
            <button
              key={num}
              disabled={(isOccupied && !isMine) || processing}
              onClick={() => handleToggleTicket(num)}
              className={`
                aspect-square flex items-center justify-center rounded-xl font-bold text-sm transition-all transform hover:scale-105 active:scale-90
                ${isMine 
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-xl z-10' 
                  : !isOccupied 
                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-100' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                }
              `}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* BANNER FLOTANTE */}
      {(mySelectedNumbers?.length > 0) && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl bg-gray-900 text-white p-5 rounded-3xl shadow-2xl flex justify-between items-center z-50 border border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white">
              <Ticket size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Has seleccionado</p>
              <h3 className="text-xl font-black">{mySelectedNumbers.length} {mySelectedNumbers.length === 1 ? 'número' : 'números'}</h3>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/mis-tickets')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black transition-all group"
          >
            PAGAR AHORA
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RaffleDetails;