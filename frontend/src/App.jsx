// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Componentes y Páginas
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RaffleDetails from './pages/RaffleDetails';
import MyTickets from './pages/MyTickets';
import AdminPanel from './pages/AdminPanel'; // Asegúrate de que la ruta sea correcta

// Componente para proteger rutas (Solo logueados)
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null; // Evita redirecciones mientras carga
  return user ? children : <Navigate id="login-redirect" to="/login" />;
};

// Componente para proteger rutas de Admin
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null; // Evita redirecciones mientras carga
  return user && user.role === 'admin' ? children : <Navigate id="admin-redirect" to="/" />;
};

function App() {
  // Nota: No necesitamos extraer 'user' aquí porque lo usaremos 
  // a través de los componentes AdminRoute y PrivateRoute

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Notificaciones flotantes */}
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: '#333',
              color: '#fff',
            },
          }} 
        />
        
        <Navbar />

        {/* Contenido principal con padding para que no pegue a los bordes */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/raffle/:id" element={<RaffleDetails />} />

            {/* Rutas de Usuario (Protegidas) */}
            <Route 
              path="/my-tickets" 
              element={
                <PrivateRoute>
                  <MyTickets />
                </PrivateRoute>
              } 
            />

            {/* Rutas de Administrador (Protegidas) */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              } 
            />

            {/* Redirección por defecto si la ruta no existe */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer sencillo */}
        <footer className="py-8 bg-white border-t border-gray-100 text-center text-gray-500 text-sm">
          <p>&copy; 2026 SistemaRifas Venezuela. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;