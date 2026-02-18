import { useState } from 'react';
import { LayoutDashboard, Ticket, Wallet, LifeBuoy, LogOut } from 'lucide-react';
import DashboardHome from './DashboardHome';
import RafflesCRUD from './RafflesCRUD';
import PaymentsControl from './PaymentsControl';
import SupportTickets from './SupportTickets';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rifas', label: 'Gestión de Rifas', icon: Ticket },
    { id: 'pagos', label: 'Control de Pagos', icon: Wallet },
    { id: 'soporte', label: 'Soporte', icon: LifeBuoy },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome />;
      case 'rifas': return <RafflesCRUD />;
      case 'pagos': return <PaymentsControl />;
      case 'soporte': return <SupportTickets />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col p-6">
        <div className="mb-10 px-2">
          <h2 className="text-2xl font-black text-blue-600 tracking-tight">ADMIN TIGRITO</h2>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl mt-auto transition-all">
          <LogOut size={20} /> Salir
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout;