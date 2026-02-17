import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Check, X, Eye, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get('/payments/all?status=pending');
      setPayments(data.payments);
    } catch (error) {
      toast.error("Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    const adminNotes = status === 'rejected' ? window.prompt("Motivo del rechazo:") : "Pago verificado";
    if (status === 'rejected' && !adminNotes) return;

    try {
      await api.put(`/payments/verify/${id}`, { status, adminNotes });
      toast.success(`Pago ${status === 'approved' ? 'aprobado' : 'rechazado'}`);
      fetchPayments();
    } catch (error) {
      toast.error("Error al procesar");
    }
  };

  if (loading) return <Loader2 className="animate-spin mx-auto" />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black">Validación de Pagos Móviles</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-sm uppercase">
              <th className="pb-4 font-black">Usuario / Ticket</th>
              <th className="pb-4 font-black">Referencia</th>
              <th className="pb-4 font-black">Comprobante</th>
              <th className="pb-4 font-black text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition">
                <td className="py-4">
                  <p className="font-bold text-gray-900">{p.user?.name}</p>
                  <p className="text-xs text-blue-600 font-bold">Ticket #{p.ticket?.number}</p>
                </td>
                <td className="py-4 font-mono font-bold text-gray-600">{p.reference}</td>
                <td className="py-4">
                  <a href={p.evidenceUrl} target="_blank" className="text-blue-500 hover:underline flex items-center gap-1 text-sm font-bold">
                    <Eye size={16} /> Ver Foto
                  </a>
                </td>
                <td className="py-4 text-right space-x-2">
                  <button onClick={() => handleVerify(p._id, 'approved')} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition">
                    <Check size={20} />
                  </button>
                  <button onClick={() => handleVerify(p._id, 'rejected')} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition">
                    <X size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="text-center py-10 text-gray-400 font-medium">No hay pagos pendientes por ahora. ✨</p>}
      </div>
    </div>
  );
};

export default AdminPayments;