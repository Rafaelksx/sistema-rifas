import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Check, X, Eye, ExternalLink, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentsManager = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await api.get('/admin/payments'); // Ajusta a tu ruta
      setPayments(data);
    };
    fetchPayments();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await api.put(`/admin/tickets/confirm/${id}`, { status });
      toast.success(status === 'paid' ? "Pago aprobado" : "Pago rechazado");
      // Recargar lista...
    } catch (error) { toast.error("Error al procesar"); }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black">Control de Pagos Móvil</h2>
      
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Usuario</th>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Banco / Ref</th>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Monto</th>
              <th className="p-6 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payments.map(p => (
              <tr key={p._id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-6">
                  <p className="font-bold text-slate-900">{p.user?.name}</p>
                  <p className="text-xs text-slate-400 italic">V-{p.user?.rif || 'No RIF'}</p>
                </td>
                <td className="p-6">
                  <p className="font-bold text-blue-600">{p.bankOrigin}</p>
                  <p className="text-xs font-mono text-slate-400">#{p.referenceNumber}</p>
                </td>
                <td className="p-6">
                  <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl font-black text-sm">
                    ${p.amount}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center gap-3">
                    <button className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all">
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleVerify(p.ticket, 'paid')}
                      className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                    >
                      <Check size={18} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => handleVerify(p.ticket, 'available')}
                      className="p-3 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-all"
                    >
                      <X size={18} strokeWidth={3} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsManager;