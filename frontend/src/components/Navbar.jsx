// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { Ticket, User, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <Ticket size={28} />
          <span>SistemaRifas</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600 font-medium">Rifas</Link>
          
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-red-500 font-bold">Admin</Link>
              )}
              <div className="flex items-center gap-2 text-gray-700">
                <User size={18} />
                <span>{user.name}</span>
              </div>
              <button onClick={logout} className="text-gray-500 hover:text-red-500">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;