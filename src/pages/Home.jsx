import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ModelCard from "../components/ModelCard";

const Home = () => {
  const [modelos, setModelos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [complexidadeAtiva, setComplexidadeAtiva] = useState("Todas");
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
    const matchComplexidade = complexidadeAtiva === "Todas" || m.complexidade === complexidadeAtiva;
    return matchBusca && matchCategoria && matchComplexidade;
  });

  const categorias = ["Todos", "Contratos", "Petições", "Recursos", "Pareceres"];
  const complexidades = ["Todas", "Baixa", "Média", "Alta"];

  return (
    <div className="ml-15 pt-10 p-10 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Painel JuriModelos</h1>
          <p className="text-slate-500 text-lg font-medium">CW Advocacia - Gestão de Acervo</p>
        </div>
        <button
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          onClick={() => navigate("/novo-Modelo")}
        >
          + Novo Modelo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Modelos no Banco</p>
          <h2 className="text-4xl font-black text-[#0e1e3f]">{modelos.length}</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Filtro Atual</p>
          <h2 className="text-4xl font-black text-[#0e1e3f]">{modelosFiltrados.length}</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Status do Acesso</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <h2 className="text-xl font-bold text-slate-700">ADMIN</h2>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-10 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Especialidade</span>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
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
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Complexidade</span>
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

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-bold text-lg">Sincronizando...</p>
        </div>
      ) : modelosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modelosFiltrados.map((m) => (
            <ModelCard
              key={m.id || m._id}
              modelo={m}
              onSelect={() => navigate(`/modelo/${m.id || m._id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] p-20 border-2 border-dashed border-slate-200 text-center">
          <p className="text-xl font-medium text-slate-400">Nenhum documento encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default Home;