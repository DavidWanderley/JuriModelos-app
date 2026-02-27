import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ModelCard from "../components/ModelCard";

const Home = () => {
  const [modelos, setModelos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        setLoading(true);
        const response = await api.get("/modelos");
        setModelos(response.data);
      } catch (error) {
        console.error("Erro ao carregar modelos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModelos();
  }, []);

  const modelosFiltrados = modelos.filter((m) => {
    const matchBusca = m.titulo.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = categoriaAtiva === "Todos" || m.categoria === categoriaAtiva;
    return matchBusca && matchCategoria;
  });

  const categorias = ["Todos", "Trabalhista", "Cível", "Contratos", "Petições", "Recursos"];

  return (
    <div className="ml-64 pt-24 p-8 bg-slate-50 min-h-screen">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Modelos Jurídicos</h1>
          <p className="text-slate-500 text-sm">Gerencie o acervo da CW Advocacia</p>
        </div>
        <button 
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          onClick={() => navigate("/novo-Modelo")}
        >
          <span>+</span> Novo Modelo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total de Modelos</p>
          <h2 className="text-3xl font-black text-slate-800">{modelos.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Busca Atual</p>
          <h2 className="text-3xl font-black text-slate-800">{modelosFiltrados.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Acesso</p>
          <h2 className="text-xl font-bold text-amber-600 mt-2">Administrador</h2>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-bold uppercase tracking-widest">Especialidades</span>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categorias.map((cat) => {
            const count = cat === "Todos" 
              ? modelos.length 
              : modelos.filter(m => m.categoria === cat).length;
            const isActive = categoriaAtiva === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? "bg-[#0e1e3f] text-white shadow-md scale-105" 
                    : "bg-white text-slate-500 border border-slate-200 hover:border-amber-500"
                }`}
              >
                {cat}
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${isActive ? "bg-amber-500 text-[#0e1e3f]" : "bg-slate-100 text-slate-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Carregando modelos...</div>
      ) : modelosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modelosFiltrados.map((m) => (
            <ModelCard
              key={m.id}
              modelo={m}
              onSelect={(id) => navigate(`/generate/${id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-20 border-2 border-dashed border-slate-200 text-center">
          <p className="text-slate-400">Nenhum modelo encontrado para esta seleção.</p>
        </div>
      )}
    </div>
  );
};

export default Home;