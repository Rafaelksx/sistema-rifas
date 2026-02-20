import { Link } from 'react-router-dom';
import { Trophy, ShieldCheck, Zap, ArrowRight, Users, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION - El impacto visual inicial */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-black mb-6 animate-bounce">
              🚀 ¡EL PRÓXIMO GANADOR PUEDES SER TÚ!
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
              Gana premios <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
                extraordinarios.
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mb-12 font-medium leading-relaxed">
              La plataforma de rifas más transparente y segura de Venezuela. 
              Participa desde $1 y cambia tu suerte hoy mismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/explorar" 
                className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center gap-2 shadow-2xl shadow-slate-200"
              >
                Ver Rifas Disponibles <ArrowRight size={22} />
              </Link>
              <Link 
                to="/register" 
                className="bg-white border-2 border-slate-100 text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all"
              >
                Crear mi Cuenta
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
      </section>

      {/* FEATURES - Por qué confiar en nosotros */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-shadow border border-slate-100">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-100">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">100% Seguro</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Resultados basados en loterías oficiales para garantizar total transparencia en cada sorteo.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-shadow border border-slate-100">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-100">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Pagos Rápidos</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Procesamos tus boletos al instante vía Pago Móvil. Sin esperas, sin complicaciones.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-shadow border border-slate-100">
              <div className="w-16 h-16 bg-pink-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-pink-100">
                <Trophy size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Grandes Premios</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Desde tecnología hasta efectivo. Premios seleccionados para mejorar tu calidad de vida.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 border-y border-slate-100 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-black text-slate-900">+500</p>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">Usuarios</p>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900">+100</p>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">Sorteos</p>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900">$2k+</p>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">Entregados</p>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900">100%</p>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">Confianza</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;