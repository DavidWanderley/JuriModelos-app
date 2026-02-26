import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import GenerateDocument from '../pages/GenerateDocument';
import CreateModel from '../pages/CreateModel'; 
import Layout from '../components/Layout'; // O novo componente

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Modificamos o PrivateRoute para envolver o conteúdo no Layout
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? (
    <Layout>{children}</Layout> 
  ) : (
    <Navigate to="/login" />
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    
    <Route path="/" element={
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    } />
    
    <Route path="/novo-Modelo" element={
      <PrivateRoute>
        <CreateModel />
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