import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, CreditCard, MessageSquare, PlusCircle } from 'lucide-react';

// Importaremos estos mini-componentes a continuación
import AdminSummary from '../components/admin/AdminSummary';
import AdminRaffles from '../components/admin/AdminRaffles';
import AdminPayments from '../components/admin/AdminPayments';

const AdminDashboard = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Resumen' },
    { path: '/admin/raffles', icon: <Ticket size={20} />, label: 'Gestionar Rifas' },
    { path: '/admin/payments', icon: <CreditCard size={20} />, label: 'Verificar Pagos' },
    { path: '/admin/support', icon: <MessageSquare size={20} />, label: 'Reclamos' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[80vh]">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 space-y-2">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Menú Admin</p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* CONTENIDO DINÁMICO */}
      <section className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <Routes>
          <Route path="/" element={<AdminSummary />} />
          <Route path="/raffles" element={<AdminRaffles />} />
          <Route path="/payments" element={<AdminPayments />} />
        </Routes>
      </section>
    </div>
  );
};

export default AdminDashboard;