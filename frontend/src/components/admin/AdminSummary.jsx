// src/components/admin/AdminSummary.jsx
import { TrendingUp, Users, Ticket, DollarSign } from 'lucide-react';

const AdminSummary = () => {
  const stats = [
    { label: 'Ingresos Totales', value: '$1,250', icon: <DollarSign />, color: 'bg-green-100 text-green-600' },
    { label: 'Usuarios', value: '142', icon: <Users />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Tickets Vendidos', value: '85', icon: <Ticket />, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black">Resumen del Sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSummary;