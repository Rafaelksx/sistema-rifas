// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import RaffleCard from '../components/RaffleCard';
import { Loader2, ShieldCheck, Zap, Smartphone, ArrowDown } from 'lucide-react';

const Home = () => {
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const { data } = await api.get('/raffles?status=active');
        setRaffles(data.raffles);
      } catch (error) {
        console.error("Error cargando rifas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRaffles();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. SECCIÓN HERO */}
      <section className="relative py-20 overflow-hidden">
        <div className="text-center space-y-8 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
            Tu oportunidad de ganar <br />
            <span className="text-blue-600">está a un clic.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Participa en las mejores rifas de Venezuela de forma segura, rápida y transparente. 
            ¡Elige tu número de la suerte ahora!
          </p>
          <div className="flex justify-center gap-4">
            <a href="#rifas" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200">
              Ver Rifas Activas
            </a>
          </div>
        </div>
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* 2. CÓMO FUNCIONA */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold">1. Elige tu número</h3>
          <p className="text-gray-500">Selecciona los boletos que desees de nuestras rifas activas.</p>
        </div>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
            <Smartphone size={32} />
          </div>
          <h3 className="text-xl font-bold">2. Paga y Reporta</h3>
          <p className="text-gray-500">Realiza tu Pago Móvil y sube el comprobante al sistema.</p>
        </div>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold">3. ¡Ya estás participando!</h3>
          <p className="text-gray-500">Una vez verificado, tu número quedará asegurado para el sorteo.</p>
        </div>
      </section>

      {/* 3. SECCIÓN DE RIFAS */}
      <section id="rifas" className="scroll-mt-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Rifas Disponibles</h2>
            <p className="text-gray-500">No te quedes fuera, el tiempo corre.</p>
          </div>
          <div className="text-blue-600 font-bold flex items-center gap-2 animate-bounce">
            <ArrowDown size={20} /> Desliza para ver más
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : raffles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 text-lg">Próximamente nuevas rifas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {raffles.map((raffle) => (
              <RaffleCard key={raffle._id} raffle={raffle} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;