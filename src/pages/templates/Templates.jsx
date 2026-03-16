import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const perfil = localStorage.getItem("perfil");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get("/templates");
        setTemplates(response.data.data || []);
      } catch (error) {
        console.error("Erro ao carregar templates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const templatesFiltrados = templates.filter((t) =>
    t.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl ml-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">⚙️ Templates de Automação</h1>
            <p className="text-slate-500 font-medium">Modelos com chaves para geração automática</p>
          </div>
          {perfil === "admin" && (
            <button
              onClick={() => navigate("/novo-template")}
              className="bg-[#0e1e3f] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              + Novo Template
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Buscar Template</p>
            <input
              type="text"
              placeholder="Digite o título..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full mt-2 p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-700"
            />
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total de Templates</p>
            <h2 className="text-3xl font-black text-[#0e1e3f]">{templatesFiltrados.length}</h2>
          </div>
        </div>

        {templatesFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templatesFiltrados.map((template) => (
              <div
                key={template.id}
                onClick={() => navigate(`/template/${template.id}`)}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">⚙️</span>
                  {perfil === "admin" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editar-template/${template.id}`);
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-amber-600"
                    >
                      EDITAR
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{template.titulo}</h3>
                <p className="text-sm text-slate-500">
                  Clique para usar na geração de documentos
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 border-2 border-dashed border-slate-200 text-center">
            <div className="text-5xl mb-4">⚙️</div>
            <p className="text-xl font-medium text-slate-400">Nenhum template encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
