import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import GenerateDocument from '../pages/GenerateDocument';
import CreateModel from '../pages/CreateModel'; 
import Layout from '../components/Layout'; 

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null && token !== "" && token !== "undefined";
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? (
    <Layout>{children}</Layout> 
  ) : (
    <Navigate to="/login" replace /> 
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