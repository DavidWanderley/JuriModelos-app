import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import GenerateDocument from '../pages/GenerateDocument';

// Simulação de autenticação
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    
    <Route path="/" element={
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    } />
    
    <Route path="/generate/:id" element={
      <PrivateRoute>
        <GenerateDocument />
      </PrivateRoute>
    } />
  </Routes>
);

export default AppRoutes;