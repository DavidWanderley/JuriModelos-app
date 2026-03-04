import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/publicas/Login";
import Home from "../pages/home/Home";
import GenerateDocument from "../pages/generate/GenerateDocument";
import CreateModel from "../pages/modelos/CreateModel";
import DetalhamentoModelo from "../pages/modelos/DetalhamentoModelo";
import EditModel from "../pages/modelos/EditModel";
import Historico from "../pages/historico/Historico";
import Layout from "../components/Layout";
import NotFound from "../pages/publicas/NotFound";
import SignUp from "../pages/publicas/SignUp";
import ForgotPassword from "../pages/publicas/ForgotPassword";
import ResetPassword from "../pages/publicas/ResetPassword";
import Clientes from "../pages/clientes/Clientes";
import CreateCliente from "../pages/clientes/CreateCliente";

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
      path="/clientes/novo"
      element={
        <PrivateRoute>
          <CreateCliente />
        </PrivateRoute>
      }
    />

    <Route
      path="/historico"
      element={
        <PrivateRoute>
          <Historico />
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
      path="/clientes"
      element={
        <PrivateRoute>
          <Clientes />
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
