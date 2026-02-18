import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

const PaymentsControl = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Validación de Pagos</h1>
      
      <div className="grid gap-4">
        {/* Simulación de un item de pago */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Wallet size={24} />
            </div>
            <div>
              <p className="font-black text-lg">V-25.123.456 - Pago Móvil</p>
              <p className="text-gray-400 text-sm italic underline">Ref: 992834 (Banco Mercantil)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <span className="font-black text-xl text-blue-600">$5.00</span>
             <div className="flex gap-2">
                <button className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-all"><CheckCircle size={20}/></button>
                <button className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all"><XCircle size={20}/></button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsControl;