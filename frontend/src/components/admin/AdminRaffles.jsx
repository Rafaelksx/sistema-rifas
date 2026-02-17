// src/components/admin/AdminRaffles.jsx
import { useState } from 'react';
import api from '../../api/axios';
import { Plus, Loader2, Calendar, DollarSign,Hash } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminRaffles = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', totalNumbers: '', drawDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/raffles', formData);
      toast.success("¡Rifa creada con éxito!");
      setFormData({ title: '', description: '', price: '', totalNumbers: '', drawDate: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear la rifa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900">Gestionar Rifas</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 space-y-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Plus className="text-blue-600" size={20} /> Crear Nueva Rifa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">Título del Sorteo</label>
            <input 
              type="text" required
              className="w-full p-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: iPhone 15 Pro Max"
              value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">Precio por Ticket ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="number" required
                className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="5.00"
                value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">Cantidad de Números</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="number" required
                className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="100"
                value={formData.totalNumbers} onChange={(e) => setFormData({...formData, totalNumbers: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">Fecha del Sorteo</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="datetime-local" required
                className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.drawDate} onChange={(e) => setFormData({...formData, drawDate: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600">Descripción</label>
          <textarea 
            rows="3"
            className="w-full p-3 rounded-xl border-gray-200 border focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Detalles del premio, condiciones..."
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        <button 
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-gray-400"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Generar Rifa y Tickets'}
        </button>
      </form>
    </div>
  );
};

export default AdminRaffles;