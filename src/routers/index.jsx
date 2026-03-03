import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import GenerateDocument from "../pages/GenerateDocument";
import CreateModel from "../pages/CreateModel";
import DetalhamentoModelo from "../pages/DetalhamentoModelo";
import EditModel from "../pages/EditModel";
import Layout from "../components/Layout";
import NotFound from "../pages/NotFound";
import SignUp from '../pages/SignUp'; 
import ForgotPassword from '../pages/ForgotPassword'; 
import ResetPassword from '../pages/ResetPassword';

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
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

    <Route path="/criar-conta" element={<SignUp />} />
    <Route path="/esqueci-a-senha" element={<ForgotPassword />} />

    <Route path="/reset-password/:token" element={<ResetPassword />} />

    <Route
      path="/"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />

    <Route
      path="/novo-Modelo"
      element={
        <PrivateRoute>
          <CreateModel />
        </PrivateRoute>
      }
    />

    <Route
      path="/modelo/:id"
      element={
        <PrivateRoute>
          <DetalhamentoModelo />
        </PrivateRoute>
      }
    />

    <Route
      path="/editar-modelo/:id"
      element={
        <PrivateRoute>
          <EditModel />
        </PrivateRoute>
      }
    />

    <Route
      path="/generate/:id"
      element={
        <PrivateRoute>
          <GenerateDocument />
        </PrivateRoute>
      }
    />

    <Route
      path="*"
      element={
        <PrivateRoute>
          <NotFound />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
