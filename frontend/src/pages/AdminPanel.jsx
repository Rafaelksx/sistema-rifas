import React, { useState } from 'react';
import { 
  LayoutDashboard, Ticket, Wallet, LifeBuoy, 
  Settings, LogOut, Bell, Search, Plus 
} from 'lucide-react';

// Importamos los submódulos (los crearemos a continuación)
import AdminStats from '../components/admin/AdminStats';
import RafflesManager from '../components/admin/RafflesManager';
import PaymentsManager from '../components/admin/PaymentsManager';
import SupportManager from '../components/admin/SupportManager';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rifas', label: 'Rifas', icon: Ticket },
    { id: 'pagos', label: 'Pagos Móvil', icon: Wallet },
    { id: 'soporte', label: 'Soporte', icon: LifeBuoy },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-8">
        <div className="mb-12 flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black">T</div>
          <h2 className="text-xl font-black tracking-tighter">TIGRITO<span className="text-blue-600">ADMIN</span></h2>
        </div>
        
        <nav className="flex-1 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.2rem] font-bold transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon size={22} strokeWidth={2.5} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50">
          <button className="w-full flex items-center gap-4 px-5 py-4 text-red-500 font-bold hover:bg-red-50 rounded-[1.2rem] transition-all">
            <LogOut size={22} strokeWidth={2.5} /> Salir
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Superior */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" placeholder="Buscar pagos, tickets o usuarios..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-100"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-black italic">Admin Rafael</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">Superuser</p>
              </div>
              <div className="w-12 h-12 bg-slate-200 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael" alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Contenedor de Módulos */}
        <section className="flex-1 overflow-y-auto p-10">
          {activeTab === 'dashboard' && <AdminStats />}
          {activeTab === 'rifas' && <RafflesManager />}
          {activeTab === 'pagos' && <PaymentsManager />}
          {activeTab === 'soporte' && <SupportManager />}
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;