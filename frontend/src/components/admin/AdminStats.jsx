import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const AdminStats = () => {
  const stats = [
    { label: 'Ventas Totales', value: '$4,250', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Usuarios Activos', value: '1,120', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Rifas en Curso', value: '12', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Tickets Vendidos', value: '856', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`${s.bg} ${s.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
              <s.icon size={28} />
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
            <h3 className="text-3xl font-black text-slate-900">{s.value}</h3>
          </div>
        ))}
      </div>
      
      {/* Aquí podrías agregar una gráfica con Recharts */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-96 flex items-center justify-center">
        <p className="text-slate-300 font-bold italic text-lg">Visualización de ventas mensuales (Gráfica)</p>
      </div>
    </div>
  );
};

export default AdminStats;