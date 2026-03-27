import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { CATEGORIAS } from "../../utils/constants";

import ModelCard from "../../components/ModelCard";

const Modelos = () => {
  const [modelos, setModelos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [complexidadeAtiva, setComplexidadeAtiva] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const perfil = localStorage.getItem("perfil");

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await api.get("/modelos");
        setModelos(response.data);
      } catch (error) {
        console.error("Erro ao carregar modelos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModelos();
  }, []);

  const modelosFiltrados = modelos.filter((m) => {
    const matchBusca = m.titulo.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = categoriaAtiva === "Todos" || m.categoria === categoriaAtiva;
    const matchComplexidade = complexidadeAtiva === "Todas" || m.complexidade === complexidadeAtiva;
    return matchBusca && matchCategoria && matchComplexidade;
  });

  const categorias = ["Todos", ...CATEGORIAS];
  const complexidades = ["Todas", "Baixa", "Média", "Alta"];

  if (loading) {
    return (
      <div className="ml-64 pt-24 p-10 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl ml-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">📋 Biblioteca de Modelos</h1>
            <p className="text-slate-500 font-medium">Acervo jurídico da CW Advocacia</p>
          </div>
          {perfil === "admin" && (
            <button
              onClick={() => navigate("/novo-modelo")}
              className="bg-[#0e1e3f] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              + Novo Modelo
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Busca Ativa</p>
            <input
              type="text"
              placeholder="Buscar modelo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full mt-2 p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-700"
            />
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total de Modelos</p>
            <h2 className="text-3xl font-black text-[#0e1e3f]">{modelos.length}</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Filtrados</p>
            <h2 className="text-3xl font-black text-amber-600">{modelosFiltrados.length}</h2>
          </div>
        </div>

        <div className="space-y-6 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3">Categoria</span>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaAtiva(cat)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    categoriaAtiva === cat ? "bg-[#0e1e3f] text-white shadow-lg" : "bg-slate-50 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3">Complexidade</span>
            <div className="flex gap-3">
              {complexidades.map((comp) => (
                <button
                  key={comp}
                  onClick={() => setComplexidadeAtiva(comp)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all border ${
                    complexidadeAtiva === comp ? "bg-amber-500 border-amber-500 text-white shadow-md" : "bg-white border-slate-200 text-slate-500 hover:border-amber-500"
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {modelosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modelosFiltrados.map((modelo) => (
              <ModelCard
                key={modelo.id}
                modelo={modelo}
                onSelect={() => navigate(`/modelo/${modelo.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 border-2 border-dashed border-slate-200 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-xl font-medium text-slate-400">Nenhum modelo encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modelos;
