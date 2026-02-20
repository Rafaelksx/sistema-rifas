import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Ticket, Search, Filter, Trophy, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const RafflesExplore = () => {
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // 'active' o 'closed'

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/raffles');
        setRaffles(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Error al cargar el catálogo");
      } finally {
        setLoading(false);
      }
    };
    fetchRaffles();
  }, []);

  // Filtrado lógico
  const filteredRaffles = raffles.filter(r => r.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header del Explorador */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Explorar Sorteos</h2>
          <p className="text-slate-500 font-medium">Encuentra tu oportunidad de ganar hoy mismo.</p>
        </div>

        {/* Selector de Filtros Estilo "Pills" */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-3 rounded-xl font-black text-sm transition-all ${
              filter === 'active' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Disponibles
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-6 py-3 rounded-xl font-black text-sm transition-all ${
              filter === 'closed' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Finalizadas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-purple-600" size={40} /></div>
      ) : (
        <>
          {filteredRaffles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRaffles.map((raffle) => (
                <RaffleCard key={raffle._id} raffle={raffle} isClosed={filter === 'closed'} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search className="text-slate-300" size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900">No hay rifas en esta categoría</h3>
              <p className="text-slate-500">Intenta cambiando el filtro o vuelve más tarde.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Sub-componente RaffleCard para limpieza visual
const RaffleCard = ({ raffle, isClosed }) => (
  <div className={`bg-white rounded-[32px] border border-slate-100 overflow-hidden transition-all duration-300 ${isClosed ? 'opacity-80 grayscale-[0.5]' : 'hover:shadow-2xl hover:-translate-y-1'}`}>
    <div className={`p-8 ${isClosed ? 'bg-slate-100' : 'bg-gradient-to-br from-purple-50 to-indigo-50'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isClosed ? 'bg-slate-200 text-slate-500' : 'bg-purple-100 text-purple-600'}`}>
          {isClosed ? 'Finalizado' : '🔥 Popular'}
        </div>
        <span className="font-black text-slate-900 text-xl">${raffle.ticketPrice}</span>
      </div>
      <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">{raffle.title}</h3>
      <p className="text-slate-500 text-sm font-medium line-clamp-2">{raffle.description}</p>
    </div>
    
    <div className="p-8 bg-white">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex -space-x-2">
           <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">JD</div>
           <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[10px] font-bold">MP</div>
        </div>
        <span className="text-xs font-bold text-slate-400">+120 participantes</span>
      </div>

      <Link
        to={`/raffle/${raffle._id}`}
        className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
          isClosed 
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'
        }`}
      >
        {isClosed ? 'Ver Ganador' : 'Comprar Ticket'} <ArrowRight size={18} />
      </Link>
    </div>
  </div>
);

export default RafflesExplore;