import { createContext, useContext, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jobtrail_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('jobtrail_token') || null);

  const login = async (email, password) => {
    const data = await authApi.loginUser(email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('jobtrail_user', JSON.stringify(data.user));
    localStorage.setItem('jobtrail_token', data.token);
    return data.user;
  };

  const register = async ({ name, email, password }) => {
    const data = await authApi.registerUser({ name, email, password });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('jobtrail_user', JSON.stringify(data.user));
    localStorage.setItem('jobtrail_token', data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jobtrail_user');
    localStorage.removeItem('jobtrail_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);