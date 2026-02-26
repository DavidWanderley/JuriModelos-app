import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ModelCard from "../components/ModelCard";
import "../styles/Home.css";

const Home = () => {
  const [modelos, setModelos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await api.get("/modelos");
        setModelos(response.data);
      } catch (error) {
        console.error("Erro ao carregar modelos", error);
      }
    };
    fetchModelos();
  }, []);

  const modelosFiltrados = modelos.filter((m) => {
    const matchBusca = m.titulo.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria =
      categoriaAtiva === "Todos" || m.categoria === categoriaAtiva;
    return matchBusca && matchCategoria;
  });

  return (
    <div className="home-container">
      <button className="btn-new-model" onClick={() => navigate("/novo-Modelo")}>
        + Novo Modelo
      </button>
      <div className="stats-container">
        <div className="stat-card">
          <h2>{modelos.length}</h2>
          <p>Modelos Disponíveis</p>
        </div>
        <div className="stat-card">
          <h2>0</h2>
          <p>Downloads Totais</p>
        </div>
        <div className="stat-card">
          <h2>Admin</h2>
          <p>Seu Acesso</p>
        </div>
      </div>
      <div className="search-section">
        <input
          type="text"
          placeholder="Buscar modelos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
      <div className="category-filters">
        {["Todos", "Contratos", "Petições", "Recursos", "Pareceres"].map(
          (cat) => (
            <button
              key={cat}
              className={categoriaAtiva === cat ? "active" : ""}
              onClick={() => setCategoriaAtiva(cat)}
            >
              {cat}
            </button>
          ),
        )}
      </div>
      <div className="model-grid">
        {modelosFiltrados.map((m) => (
          <ModelCard
            key={m.id}
            modelo={m}
            onSelect={(id) => navigate(`/generate/${id}`)} // Navega para a geração
          />
        ))}
      </div>
      {modelosFiltrados.length === 0 && (
        <p className="no-results">Nenhum modelo encontrado.</p>
      )}
    </div>
  );
};

export default Home;
