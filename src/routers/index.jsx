import { Routes, Route, Navigate } from "react-router-dom";
import { storage } from "../services/storage";
import { ROUTES } from "../utils/routes";
import Login from "../pages/publicas/Login";
import Home from "../pages/home/Home";
import Templates from "../pages/templates/Templates";
import CreateTemplate from "../pages/templates/CreateTemplate";
import EditTemplate from "../pages/templates/EditTemplate";
import DetalhamentoTemplate from "../pages/templates/DetalhamentoTemplate";
import GerarDocumento from "../pages/templates/GerarDocumento";
import CreateModel from "../pages/modelos/CreateModel";
import Modelos from "../pages/modelos/Modelos";
import DetalhamentoModelo from "../pages/modelos/DetalhamentoModelo";
import EditModel from "../pages/modelos/EditModel";
import Historico from "../pages/historico/Historico";
import Agenda from "../pages/agenda/Agenda";
import Layout from "../components/Layout";
import NotFound from "../pages/publicas/NotFound";
import SignUp from "../pages/publicas/SignUp";
import ForgotPassword from "../pages/publicas/ForgotPassword";
import ResetPassword from "../pages/publicas/ResetPassword";
import Clientes from "../pages/clientes/Clientes";
import CreateCliente from "../pages/clientes/CreateCliente";
import EditCliente from "../pages/clientes/EditCliente";

const isAuthenticated = () => storage.isAuthenticated();

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to={ROUTES.LOGIN} replace />
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
      path="/template/:id"
      element={
        <PrivateRoute>
          <DetalhamentoTemplate />
        </PrivateRoute>
      }
    />

    <Route
      path="/gerar-documento/:id"
      element={
        <PrivateRoute>
          <GerarDocumento />
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
      path="/clientes/editar/:id"
      element={
        <PrivateRoute>
          <EditCliente />
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
      path="/templates"
      element={
        <PrivateRoute>
          <Templates />
        </PrivateRoute>
      }
    />

    <Route
      path="/novo-template"
      element={
        <PrivateRoute>
          <CreateTemplate />
        </PrivateRoute>
      }
    />

    <Route
      path="/editar-template/:id"
      element={
        <PrivateRoute>
          <EditTemplate />
        </PrivateRoute>
      }
    />

    <Route
      path="/modelos"
      element={
        <PrivateRoute>
          <Modelos />
        </PrivateRoute>
      }
    />

    <Route
      path="/agenda"
      element={
        <PrivateRoute>
          <Agenda />
        </PrivateRoute>
      }
    />

    <Route
      path="/novo-modelo"
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
