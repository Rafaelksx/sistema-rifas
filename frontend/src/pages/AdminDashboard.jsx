import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [raffles, setRaffles] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [view, setView] = useState('raffles'); // 'raffles' o 'payments'

    useEffect(() => {
        fetchData();
    }, [view]);

    const fetchData = async () => {
        try {
            const endpoint = view === 'raffles' ? '/admin/raffles' : '/admin/tickets';
            const { data } = await api.get(endpoint);
            if (view === 'raffles') {
                // Normalize possible shapes: array or { raffles: [...] }
                if (Array.isArray(data)) setRaffles(data);
                else if (Array.isArray(data.raffles)) setRaffles(data.raffles);
                else setRaffles([]);
            } else {
                if (Array.isArray(data)) setTickets(data);
                else if (Array.isArray(data.tickets)) setTickets(data.tickets);
                else setTickets([]);
            }
        } catch (error) {
            toast.error("Error al cargar datos");
        }
    };

    const handleDeleteRaffle = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta rifa?")) return;
        try {
            await api.delete(`/admin/raffles/${id}`);
            toast.success("Rifa eliminada");
            fetchData();
        } catch (error) { toast.error("Error al eliminar"); }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black">Panel de Control</h1>
                <div className="flex gap-4">
                    <button onClick={() => setView('raffles')} className={`px-4 py-2 rounded-xl font-bold ${view === 'raffles' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Rifas</button>
                    <button onClick={() => setView('payments')} className={`px-4 py-2 rounded-xl font-bold ${view === 'payments' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Pagos</button>
                </div>
            </div>

            {view === 'raffles' ? (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 font-bold text-gray-400 uppercase text-xs">Rifa</th>
                                <th className="p-6 font-bold text-gray-400 uppercase text-xs">Precio</th>
                                <th className="p-6 font-bold text-gray-400 uppercase text-xs">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {raffles.map(r => (
                                <tr key={r._id} className="border-b border-gray-50 last:border-0">
                                    <td className="p-6 font-bold text-gray-900">{r.title}</td>
                                    <td className="p-6 text-gray-600">${r.ticketPrice}</td>
                                    <td className="p-6 flex gap-3">
                                        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit size={18}/></button>
                                        <button onClick={() => handleDeleteRaffle(r._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid gap-4">
                    {tickets.filter(t => t.status === 'verifying').map(t => (
                        <div key={t._id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="font-black text-blue-600 text-lg">Ticket #{t.number}</p>
                                <p className="text-sm text-gray-500">Usuario: {t.user?.name} | Rifa: {t.raffle?.title}</p>
                                <p className="text-xs font-mono bg-gray-100 inline-block px-2 py-1 mt-2 rounded">Ref: {t.reference}</p>
                            </div>
                            <button 
                                onClick={() => {/* lógica para confirmar */}}
                                className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 flex items-center gap-2"
                            >
                                <CheckCircle size={18}/> Confirmar Pago
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;