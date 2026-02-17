import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext); // Asumiendo que añadiste register al context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Cuenta creada exitosamente');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4 pb-12">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900">Crear Cuenta</h2>
          <p className="text-gray-500 mt-2">Únete para participar en las rifas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Registrarme'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-purple-600 font-bold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;