// src/context/AuthContext.jsx
import { createContext, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('userInfo')) || null
  );

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    // data debe contener { _id, name, email, role, token }
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/users/register', { name, email, password });
    // data debe contener { _id, name, email, role, token }
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    // IMPORTANTE: Agregamos login y register al value para que los componentes puedan usarlos
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};