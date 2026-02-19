import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

// 1. Exportamos el contexto solo
export const AuthContext = createContext();

// 2. Exportamos el Provider como componente principal
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Configurar el token para futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  // Función de Login
  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  // Función de Registro (AQUÍ AGREGAMOS EL TELÉFONO)
  const register = async (name, email, password, phone) => {
    // Enviamos los 4 campos que el backend ahora exige
    const { data } = await api.post('/users', { name, email, password, phone });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};